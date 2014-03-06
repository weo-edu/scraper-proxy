var _ = require('lodash')
  , googleapis = require('googleapis')
  , Seq = require('seq')
  , gdocRe = /^(?:https?\:\/\/)?docs\.google\.com\/([a-zA-Z]+)\/d\/([a-zA-Z0-9]+)\/?/
  , apiKey = 'AIzaSyDCntpE09OxvK4vTsCTMlUKI-wlMi3H3SI'
  , embedTmpl = '<iframe src="<%= src %>"></iframe>'
  , provider_url = 'http://docs.google.com';

function process(client, params, cb) {
  if(! gdocRe.test(params.url)) {
    cb();
    return;
  }

  var parts = gdocRe.exec(params.url);
  client.drive.files.get({fileId: parts[2]})
    .withApiKey(apiKey)
    .execute(function(err, res) {
      var data = {};
      if(res && ! res.errors) {
        _.extend(data, {
          thumbnail_url: res.thumbnailLink.replace(/\=s\d+$/, '=w' + Math.min(params.width, params.maxwidth)),
          title: res.title,
          html: _.template(embedTmpl, {src: res.embedLink}),
          provider_url: provider_url,
          type: 'document'
        });
      }
      else {
        err = err || {reason: (res && res.reason)};
        err.provider_url = provider_url;
      }

    cb(err, data);
  });
}

module.exports = function() {
  var cb = this;
  googleapis.discover('drive', 'v2')
    .execute(function(err, client) {
      cb(err, function(params) {
        process(client, params, this);
      });
    });
};