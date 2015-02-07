var _ = require('lodash');
var Embedly = require('embedly');
var config = require('../config');
var embedTmpl = '<iframe width="<%= width %>" height="<%= height %>" src="//www.youtube.com/embed/<%= videoId %>?autoplay=<%= autoplay %>" frameborder="0" allowfullscreen></iframe>';

function youtubeParser(url){
  if(! url) return;

  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  if(match && match[7].length === 11)
    return match[7];
}

module.exports = function() {
  var cb = this;
  new Embedly({key: config.embedlyApiKey}, function(err, api) {
    if(err) throw err;
    cb(err, function(params) {
      var self = this;

      console.log('embedly', params);
      api.oembed(params, function(err, objs) {
        console.log('embedly err', err, objs);
        if(objs && objs[0] && objs[0].error_code) {
          err = objs[0];
        }

        var data = objs && objs[0];
        if(data.provider_name === 'YouTube' && data.html) {
          data.html = _.template(embedTmpl, {width: params.width, height: params.height, videoId: youtubeParser(data.url), autoplay: params.autoplay ? 1 : 0});
        }

        self(err, objs && objs[0]);
      });
    });
  });
};