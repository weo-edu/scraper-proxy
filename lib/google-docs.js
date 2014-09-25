var _ = require('lodash');
var googleapis = require('googleapis');
var Seq = require('seq');
var gdocRe1 = /^(?:https?\:\/\/)?(?:docs|drive)\.google\.com\/([a-zA-Z\-]+)\/d\/([a-zA-Z0-9\-]+)\/?/;
var gdocRe2 = /^(?:https?\:\/\/)?(?:docs|drive)\.google\.com\/([a-zA-Z\-]+)\/ccc.*(?:(?:\?key=)|(?:\&key=))([a-zA-Z0-9\-]+)\&?/;
var apiKey = 'AIzaSyDCntpE09OxvK4vTsCTMlUKI-wlMi3H3SI';
var embedTmpl = '<iframe src="<%= src %>"></iframe>';
var provider_url = 'http://docs.google.com';

function parse(url) {
  var data;
  if(gdocRe1.test(url)) {
    data = gdocRe1.exec(url);
    return {
      id: data[2],
      type: data[1]
    };
  } else if(gdocRe2.test(url)) {
    data = gdocRe2.exec(url);
    return {
      id: data[2],
      type: data[1]
    };
  }

  return false;
}

function process(client, params, cb) {
  var data = parse(params.url);
  if(! data) {
    cb();
    return;
  }

  client.drive.files.get({fileId: data.id})
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