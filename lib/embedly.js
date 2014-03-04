var Embedly = require('embedly')
  , apiKey = '578f2e0b9cb04763888f0a6c9b907b55';

module.exports = function() {
  var cb = this;
  new Embedly({key: apiKey}, function(err, api) {
    if(err) throw err;
    cb(err, function(params) {
      var self = this;
      api.oembed(params, function(err, objs) {
        self(err, objs && objs[0]);
      });
    });
  });
};