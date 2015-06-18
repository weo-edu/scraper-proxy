/**
 * Modules
 */
import Seq from 'seq'
import {defaults, extend} from 'lodash'
import express from 'express'
import Cacher from 'cacher'
import s3upload from './s3'
import toBuffer from './toBuffer'
import * as gdocs from './google-docs'
import * as embedly from './embedly'
import validate from './validate'
import preprocess from './preprocess'
import docPreview from './document-preview'
import normalizeImage from './normalizeImage'
import _debug from 'debug'

/**
 * Vars
 */
const app = express()
const debug = _debug('scraper:main')
const cacher = new Cacher()

/**
 * Exports
 */
export default app

// Prepare things that need to be
// prepared, if they haven't
// already been
app.use((req, res, next) => {
  embedly.prepare(err => {
    err
      ? next(err)
      : gdocs.prepare(next)
  })
})

app.get('/1/oembed', cacher.cache('hours', 12), (req, res, next) => {
  debug('scrape url', req.query.url)

  const params = req.query
  defaults(params, {
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
  this(null, gDocs ? gDocs : extend(embedlyData || {}, preview || {}))
}

function jsonResponse(res) {
  return function(data) {
    res.json(data)
    this()
  }
}

function upload (src, dest) {
  dest = dest || src

  return function (data) {
    if(! data[src])
      return this(null, data)

    toBuffer(data[src], (err, buffer) => {
      if(err) return this(err)

      normalizeImage(buffer, (err, buffer) => {
        if(err) return this(err)

        s3upload(buffer, (err, res) => {
          if(err) debug('error uploading', data[src], err)
          data[dest] = res && res.req.url
          this(err, data)
        })
      })
    })
  }
}