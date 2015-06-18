/**
 * Modules
 */
import Stream from 'stream'
import request from 'superagent'
import _debug from 'debug'

/**
 * Vars
 */
const debug = _debug('scraper:toBuffer')

/**
 * Takes in a data source (at the moment, just a url or a stream)
 * and convert it to a buffer
 */
export default function (source, cb) {
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
    .end((err, res) => {
      if(err) return cb(err)
      if(res.status !== 200)
        debug('download failed', res.body)

      streamToBuffer(res, cb)
    })
}

function streamToBuffer(stream, cb) {
  const bufs = []
  stream
    .on('data', data =>  bufs.push(data))
    .on('error', err => cb(err))
    .on('end', () => cb(null, Buffer.concat(bufs)))
}