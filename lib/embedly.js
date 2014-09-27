var _ = require('lodash');
var Embedly = require('embedly');
var apiKey = '578f2e0b9cb04763888f0a6c9b907b55';
var embedTmpl = '<iframe width="<%= width %>" height="<%= height %>" src="//www.youtube.com/embed/<%= videoId %>" frameborder="0" allowfullscreen></iframe>';

function youtube_parser(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  if(match && match[7].length === 11)
    return match[7];
}

module.exports = function() {
  var cb = this;
  new Embedly({key: apiKey}, function(err, api) {
    if(err) throw err;
    cb(err, function(params) {
      var self = this;
      api.oembed(params, function(err, objs) {
        if(objs && objs[0] && objs[0].error_code) {
          err = objs[0];
        }

        var data = objs && objs[0];
        if(data.provider_name === 'YouTube' && data.html)
          data.html = _.template(embedTmpl, {width: params.width, height: params.height, videoId: youtubeParser(params.url)});

        self(err, objs && objs[0]);
      });
    });
  });
};