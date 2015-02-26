var validator = require('validator');

module.exports = function(params) {
  var valid = validator.isURL(params.url);
  var err = valid ? null : {error: 'Invalid URL', code: 400};
  this(err, params);
};