var _ = require('lodash');
var googleapis = require('googleapis');
var docPreview = require('../document-preview');
var Seq = require('seq');
var gdocRe1 = /^(?:https?\:\/\/)?(?:docs|drive)\.google\.com\/([a-zA-Z\-\_]+)\/d\/([a-zA-Z0-9\-\_]+)\/?/;
var gdocRe2 = /^(?:https?\:\/\/)?(?:docs|drive)\.google\.com\/([a-zA-Z\-\_]+)\/ccc.*(?:(?:\?key=)|(?:\&key=))([a-zA-Z0-9\-\_]+)\&?/;
var embedTmpl = '<iframe src="<%= src %>"></iframe>';
var provider_url = 'http://docs.google.com';
var config = require('../config');

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
    .withApiKey(config.googleDriveApiKey)
    .execute(function(err, res) {
      var data = {};

      if(res && ! res.errors) {
        if(! res.thumbnailLink)
          res.thumbnailLink = docPreview.getLink(_.extend({}, params, {url: res.webContentLink}));
        if(! res.embedLink)
          res.embedLink = res.alternateLink;

        _.extend(data, {
          thumbnail_url: res.thumbnailLink && res.thumbnailLink.replace(/\=s\d+$/, '=w' + Math.min(params.width, params.maxwidth)),
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