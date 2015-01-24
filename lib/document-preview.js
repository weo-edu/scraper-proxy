var _ = require('lodash');
var url = require('url');
var path = require('path');
var docExts = ['.docx', '.ppt', '.doc', '.gdoc', '.pdf'];
var previewTmpl = 'http://docthumb.eos.io/?url=<%= url %>&width=<%= width %>';

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
    type: 'document'
  });
};

module.exports.getLink = getLink;