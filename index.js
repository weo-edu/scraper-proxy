var express = require('express')
  , _ = require('lodash')
  , cors = require('cors')
  , app = module.exports = express();

app.configure('development', function() {
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

app.use(cors());
app.listen(5000);

require('./routes')(app);
