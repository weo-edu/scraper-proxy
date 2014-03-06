var _ = require('lodash')
  , url = require('url')
  , path = require('path')
  , docExts = ['.docx', '.ppt', '.doc', '.gdoc', '.pdf']
  , previewTmpl = 'https://docs.google.com/viewer?url=<%= url %>&a=bi&pagenumber=<%= page %>&w=<%= width %>'

function getLink(params) {
  var parsed = url.parse(params.url)
    , ext = path.extname(parsed.pathname).split('?')[0]
    , link = _.template(previewTmpl, {
      url: params.url,
      width: params.width || 500,
      page: params.page || 1
    });

  return _.contains(docExts, ext) ? link  : null;
}

module.exports = function(params) {
  var link = getLink(params);
  if(! link) return this();
  this(null, {
    thumbnail_url: link,
    type: 'document'
  });
};