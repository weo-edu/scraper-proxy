var url = require('url')
var qs = require('qs')

module.exports = function (params) {
  var parsed = url.parse(params.url)
  if (parsed.hostname === 'google.com' || parsed.hostname === 'www.google.com') {
    if (parsed.pathname === '/imgres') {
      var qparams = qs.parse(parsed.search.slice(1))
      if (qparams.imgurl)
        params.url = qparams.imgurl
    }
  }
  this(null, params)
}
