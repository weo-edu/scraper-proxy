var Seq = require('seq')
  , _ = require('lodash');

module.exports = function(app) {
  Seq()
    .par(require('./lib/embedly'))
    .par(require('./lib/google-docs'))
    .seq(function(embedly, googleDocs) {
      app.get('/1/oembed', function(req, res) {
        var params = req.query;
        _.defaults(params, {
          width: 500
        });

        Seq([params])
          .par(googleDocs)
          .par(require('./lib/document-preview'))
          .par(embedly)
          .seq(function(gDocs, preview, embedlyData) {
            this(null, gDocs
              ? gDocs
              : _.extend(embedlyData || {}, preview || {}));
          })
          .seq(function(data) { res.json(data); })
          .catch(function(err) {
            res.send(500, err);
          });
    });
  });
};