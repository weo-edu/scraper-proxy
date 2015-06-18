var _ = require('lodash')
var url = require('url')
var path = require('path')
var config = require('./config')
var docExts = ['.docx', '.ppt', '.doc', '.gdoc', '.pdf']
var previewTmpl = config.docthumbUrl + '/?url=<%= url %>&width=<%= width %>'
var embedLinkTmpl = '<iframe src="https://drive.google.com/viewerng/viewer?url=<%= src %>&embedded=true"></iframe>'
var debug = require('debug')('scraper:document-preview')

function isDocument (href) {
  var parsed = url.parse(href)
  var ext = path.extname(parsed.pathname).split('?')[0]
  return _.contains(docExts, ext)
}

function getLink (params) {
  return _.template(previewTmpl, {
    url: encodeURIComponent(params.url),
    width: params.width || 500
  })
}

module.exports = function (params) {
  if (! isDocument(params.url))
    return this()

  var data = {
    thumbnail_url: getLink(params),
    html: _.template(embedLinkTmpl, {src: params.url}),
    type: 'document'
  }

  debug('data', data)
  this(null, data)
}

module.exports.getLink = getLink
