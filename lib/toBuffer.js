/**
 * Modules
 */
var Stream = require('stream')
var request = require('superagent')
var debug = require('debug')('scraper:toBuffer')
/**
 * Takes in a data source (at the moment, just a url or a stream)
 * and convert it to a buffer
 */
function toBuffer(source, cb) {
  if('string' === typeof source)
    urlToBuffer(source, cb)
  else if(source instanceof Stream)
    streamToBuffer(source, cb)
  else
    cb(new Error('toBuffer: Unknown data source'))
}

function urlToBuffer(url, cb) {
  request
    .get(url)
    .end(function(err, res) {
      if(res.status !== 200)
        debug('download failed', res.body)

      if(err) return cb(err)
      streamToBuffer(res, cb)
    })
}

function streamToBuffer(stream, cb) {
  var bufs = []
  stream
    .on('data', function (data) {  bufs.push(data) })
    .on('error', function(err) { cb(err) })
    .on('end', function() { cb(null, Buffer.concat(bufs)) })
}


module.exports = toBuffer