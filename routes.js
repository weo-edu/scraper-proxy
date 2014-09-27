var Seq = require('seq');
var _ = require('lodash');
var s3 = require('./lib/s3');
var base64 = require('js-base64').Base64;

module.exports = function(app, embedly, googleDocs, docPreview) {
  // Make codeship happy
  app.get('/', function(req, res) {
    res.send('up');
  });

  var re = /^[a-zA-Z0-9\=\_]+$/;
  function isBase64(str) {
    return re.test(str);
  }

  app.get('/1/oembed', function(req, res) {
    var params = req.query;
    _.defaults(params, {
      width: 500,
      maxwidth: 500
    });

    // Allow base64 encoded urls to be passed in order to defeat some
    // filtering schemes
    if(isBase64(params.url))
      params.url = base64.decode(params.url);

    Seq([params])
      .par(googleDocs)
      .par(docPreview)
      .par(embedly)
      .seq(function(gDocs, preview, embedlyData) {
        this(null, gDocs
          ? gDocs
          : _.extend(embedlyData || {}, preview || {}));
      })
      .seq(function(data) {
        if(! data.thumbnail_url)
          return this(null, data);

        var self = this;
        s3.task(data.thumbnail_url, function(err, res) {
          data.thumbnail_url = res && res.req.url;
          self(err, data);
        });
      })
      .seq(function(data) { res.json(data); })
      .catch(function(err) {
        res.send(err.code || err.error_code || 500, err);
      });
  });
};