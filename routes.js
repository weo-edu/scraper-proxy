var Seq = require('seq')
  , _ = require('lodash');

module.exports = function(app, embedly, googleDocs, docPreview) {
  app.get('/1/oembed', function(req, res) {
    var params = req.query;
    _.defaults(params, {
      width: 500,
      maxwidth: 500
    });

    Seq([params])
      .par(googleDocs)
      .par(docPreview)
      .par(embedly)
      .seq(function(gDocs, preview, embedlyData) {
        this(null, gDocs
          ? gDocs
          : _.extend(embedlyData || {}, preview || {}));
      })
      .seq(function(data) { res.json(data); })
      .catch(function(err) {
        res.send(err.code || 500, err);
      });
  });
};