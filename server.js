var express = require('express');
var app = module.exports = express();
var config = require('./lib/config');

/*
  Logging
 */
require('weo-logger')('scraper');
app.use(require('morgan')('tiny'));

/*
  Config
 */
app.configure('development', function() {
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

app.use(require('cors')());

/*
  Listen
 */
app.listen(config.port, function() {
  console.log('listening', config.port);
});

/*
  Boot
 */
app.use(require('./lib/main'));

app.use(function(err, req, res, next) {
  if(err) {
    if(err.code !== 400) console.log('err', err, err.stack);
    res.send(err.code || err.error_code || 500, err);
  } else
    next();
});