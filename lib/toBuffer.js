/**
 * Imports
 */

import Stream from 'stream'
import thunkify from 'thunkify'
import request from 'superagent'
import _debug from 'debug'
import download from 'download'

/**
 * Vars
 */

const debug = _debug('scraper:toBuffer')

/**
 * Takes in a data source (at the moment, just a url or a stream)
 * and convert it to a buffer
 */

function toBuffer (source, cb) {
  if('string' === typeof source)
    download(source)(cb)
  else if(source instanceof Stream)
    streamToBuffer(source, cb)
  else
    cb(new Error('toBuffer: Unknown data source'))
}

function streamToBuffer(stream, cb) {
  const bufs = []
  stream
    .on('data', data => bufs.push(data))
    .on('error', err => cb(err))
    .on('end', () => cb(null, Buffer.concat(bufs)))
}

/**
 * Exports
 */

export default thunkify(toBuffer)