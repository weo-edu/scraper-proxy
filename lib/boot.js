var Seq = require('seq');
var app = module.exports = require('express')();
var gdocs = require('./google-docs');
var embedly = require('./embedly');
var docPreview;
var googleDocs;

app.use(function(req, res, next) {
  embedly.prepare(function(err) {
    if(err) return next(err);

    gdocs.prepare(next);
  });
});

// Make codeship happy
app.get('/', function(req, res) {
  res.send('up');
});

app.use(require('./main'));