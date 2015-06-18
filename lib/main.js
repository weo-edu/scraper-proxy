/**
 * Modules
 * @type {[type]}
 */
var Seq = require('seq')
var _ = require('lodash')
var app = module.exports = require('express')()
var s3upload = require('./s3')
var toBuffer = require('./toBuffer')
var gdocs = require('./google-docs')
var embedly = require('./embedly')
var validate = require('./validate')
var preprocess = require('./preprocess')
var docPreview = require('./document-preview')
var normalizeImage = require('./normalizeImage')
var debug = require('debug')('scraper:main')

// Prepare things that need to be
// prepared, if they haven't
// already been
app.use(function (req, res, next) {
  embedly.prepare(function (err) {
    if (err) return next(err)

    gdocs.prepare(next)
  })
})

var Cacher = require('cacher')
var cacher = new Cacher()
app.get('/1/oembed', cacher.cache('hours', 12), function (req, res, next) {
  debug('scrape url', req.query.url)
  var params = req.query
  _.defaults(params, {
    width: 500,
    maxwidth: 500
  })

  params.url = decodeURIComponent(params.url)

  Seq([params])
    .seq(validate)
    .seq(preprocess)
    .par(gdocs.process)
    .par(docPreview)
    .par(embedly.process)
    .seq(combine)
    .par(cond(isImage, upload('url', 'image')))
    .par(upload('thumbnail_url'))
    .seq(jsonResponse(res))
    .catch(next)
})

function cond(pred, action) {
  return function(data) {
    pred(data) ? action.call(this, data) : this(null, data)
  }
}

function isImage(data) {
  return data.type === 'image' || data.type === 'photo'
}

function combine (gDocs, preview, embedlyData) {
  this(null, gDocs ? gDocs : _.extend(embedlyData || {}, preview || {}))
}

function jsonResponse(res) {
  return function(data) {
    res.json(data)
  }
}

function upload (src, dest) {
  dest = dest || src

  return function (data) {
    if(! data[src])
      return this(null, data)

    var self = this
    toBuffer(data[src], function(err, buffer) {
      if(err) return self(err)

      normalizeImage(buffer, function(err, buffer) {
        s3upload(buffer, function(err, res) {
          if(err) debug('error uploading', data[src], err)
          data[dest] = res && res.req.url
          self(err, data)
        })
      })
    })
  }
}