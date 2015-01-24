var _ = require('lodash');
var cors = require('cors');
var app = module.exports = require('express')();
var Seq = require('seq');

require('./lib/logging')('scraper');

app.configure('development', function() {
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

app.use(cors());
app.listen(process.env.PORT || 5000);


Seq()
  .par(require('./lib/embedly'))
  .par(require('./lib/google-docs'))
  .seq(function(embedly, googleDocs) {
    var docPreview = require('./lib/document-preview');
    var preprocess = require('./lib/preprocess');
    require('./routes')(app, embedly, googleDocs, docPreview, preprocess);
  });