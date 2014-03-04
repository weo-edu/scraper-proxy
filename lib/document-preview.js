var _ = require('lodash')
  , request = require('superagent')
  , uuid = require('uuid')
  , url = require('url')
  , path = require('path')
  , docExts = ['.docx', '.ppt', '.doc', '.gdoc', '.pdf']
  , knox = require('knox')
  , previewTmpl = 'https://docs.google.com/viewer?url=<%= url %>&a=bi&pagenumber=<%= page %>&w=<%= width %>'
  , s3client = knox.createClient({
    key: "AKIAIMDHEMBP5SULSA3A",
    secret: "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",
    bucket: 'dev.eos.io',
    region: 'us-west-1'
  });


module.exports = function(params) {
  var parsed = url.parse(params.url)
    , basename = path.basename(parsed.pathname)
    , ext = path.extname(parsed.pathname).split('?')[0]
    , link = params.url;

  if(! _.contains(docExts, ext)) {
    this();
    return;
  }

  var self = this
    , previewLink = _.template(previewTmpl, {
    url: link,
    page: params.page || 1,
    width: params.width || 500
  });

  request
    .get(previewLink)
    .end(function(err, res) {
      if(err) throw err;
      var bufs = [];
      res.on('data', function(data) { bufs.push(data); })
        .on('error', function(err) { self(err); })
        .on('end', function(){
          s3client.putBuffer(Buffer.concat(bufs), path.join('uploads', uuid.v4()), {
            'Content-Type': res.headers['content-type'],
            'x-amz-acl': 'public-read'
          }, function(err, res) {
            self(err, {thumbnail_url: res.req.url});
          });
        });
    });
};