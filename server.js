var express = require('express');
var app = module.exports = express();

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
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('listening', port);
});

/*
  Boot
 */
app.use(require('./lib/boot'));