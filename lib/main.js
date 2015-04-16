var Seq = require('seq');
var _ = require('lodash');
var app = module.exports = require('express')();

var s3 = require('./s3');
var gdocs = require('./google-docs');
var embedly = require('./embedly');
var validate = require('./validate');
var preprocess = require('./preprocess');
var docPreview = require('./document-preview');
var debug = require('debug')('scraper:main');

// Prepare things that need to be
// prepared, if they haven't
// already been
app.use(function(req, res, next) {
  embedly.prepare(function(err) {
    if(err) return next(err);

    gdocs.prepare(next);
  });
});

var Cacher = require('cacher');
var cacher = new Cacher();
app.get('/1/oembed', cacher.cache('hours', 12), function(req, res, next) {
  debug('scrape url', req.query.url);
  var params = req.query;
  _.defaults(params, {
    width: 500,
    maxwidth: 500
  });

  params.url = decodeURIComponent(params.url);

  Seq([params])
    .seq(validate)
    .seq(preprocess)
    .par(gdocs.process)
    .par(docPreview)
    .par(embedly.process)
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
        if(err) console.log('s3 err', data.thumbnail_url, err);
        data.thumbnail_url = res && res.req.url;
        self(err, data);
      });
    })
    .seq(function(data) {
      debug('scrape data', data);
      res.json(data);
    })
    .catch(next);
});