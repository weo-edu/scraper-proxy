var _ = require('lodash');
var url = require('url');
var path = require('path');
var config = require('./config');
var docExts = ['.docx', '.ppt', '.doc', '.gdoc', '.pdf'];
var previewTmpl = config.docthumbUrl + '/?url=<%= url %>&width=<%= width %>';
var embedLinkTmpl = '<iframe src="https://drive.google.com/viewerng/viewer?url=<%= src %>"></iframe>';

function isDocument(href) {
  var parsed = url.parse(href);
  var ext = path.extname(parsed.pathname).split('?')[0];
  return _.contains(docExts, ext);
}

function getLink(params) {
  return _.template(previewTmpl, {
    url: encodeURIComponent(params.url),
    width: params.width || 500
  });
}

module.exports = function(params) {
  if(! isDocument(params.url))
    return this();

  this(null, {
    thumbnail_url: getLink(params),
    html: _.template(embedLinkTmpl, {src: params.url}),
    type: 'document'
  });
};

module.exports.getLink = getLink;