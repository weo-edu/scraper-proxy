var Seq = require('seq');
var app = module.exports = require('express')();

Seq()
  .par(require('../embedly'))
  .par(require('../google-docs'))
  .seq(function(embedly, googleDocs) {
    var docPreview = require('../document-preview');
    var preprocess = require('../preprocess');
    require('../main')(app, embedly, googleDocs, docPreview, preprocess);
  });