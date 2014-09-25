var express = require('express')
  , _ = require('lodash')
  , cors = require('cors')
  , app = module.exports = express()
  Seq = require('seq');

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
    require('./routes')(app, embedly, googleDocs, docPreview);
  });