var _ = require('lodash');
var Embedly = require('embedly');
var config = require('./config');
var embedTmpl = '<iframe width="<%= width %>" height="<%= height %>" src="//www.youtube.com/embed/<%= videoId %>?autoplay=<%= autoplay %>" frameborder="0" allowfullscreen></iframe>';

function youtubeParser(url){
  if(! url) return;

  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  if(match && match[7].length === 11)
    return match[7];
}

var api;
exports.prepare = function(cb) {
  if(api) return cb();

  new Embedly({key: config.embedlyApiKey}, function(err, _api) {
    api = _api
    cb(err);
  });
};

exports.process = function(params) {
  var cb = this;
  api.oembed(params, function(err, objs) {
    if(! err && objs && objs[0]) {
      var data = objs[0];
      if(data.error_code) {
        err = data;
      } else if(data.provider_name === 'YouTube' && data.html) {
        data.html = _.template(embedTmpl, {width: params.width, height: params.height, videoId: youtubeParser(data.url), autoplay: params.autoplay ? 1 : 0});
      }
    }
    if(err) console.log('embedly err', err, objs);
    cb(err, data);
  });
};