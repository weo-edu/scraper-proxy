var Seq = require('seq')
  , _ = require('lodash');

module.exports = function(app) {
  Seq()
    .par(require('./lib/embedly'))
    .par(require('./lib/google-docs'))
    .seq(function(embedly, googleDocs) {
      app.get('/1/oembed', function(req, res) {
        Seq([req.query])
          .par(googleDocs)
          .par(require('./lib/document-preview'))
          .par(embedly)
          .seq(function(gDocs, preview, embedlyData) {
            if(gDocs) this(null, gDocs);
            else _.extend(embedlyData, preview);
          })
          .seq(function(data) { res.json(data); })
          .catch(function(err) {
            res.send(500, err);
          });
    });
  });
};