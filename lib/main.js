/**
 * Modules
 */
import {defaults, extend, clone} from 'lodash'
import koa from 'koa'
import route from 'koa-route'
import compose from 'koa-compose'
import cash from 'koa-cash'
import lru from 'lru-cache'
import s3upload from './s3'
import toBuffer from './toBuffer'
import * as gdocs from './google-docs'
import * as embedly from './embedly'
import validate from './validate'
import preprocess from './preprocess'
import docPreview from './document-preview'
import normalizeImage from './normalizeImage'
import handleError from './handleError'
import _debug from 'debug'

/**
 * Vars
 */
const app = koa()
const debug = _debug('scraper:main')
const cache = lru({maxAge: 60*60*24})

/**
 * Exports
 */
export default app

/**
 * Error Handling
 */
app.use(handleError)

/**
 * Response Caching
 */
app.use(cash({
  get: function *(key, maxAge) {
    return cache.get(key)
  },
  set: function *(key, value) {
    cache.set(key, value)
  }
}))

app.use(function *(next) {
  if(yield *this.cashed())
    return
  yield next
})

/**
 * Health Check
 */

app.use(route.get('/', function *(next) {
  this.body = 'up'
  yield next
}))

/**
 * Main
 */


// Prepare things that need to be
// prepared, if they haven't
// already been
app.use(function *(next) {
  yield embedly.prepare()
  yield gdocs.prepare()
  yield *next
})

app.use(route.get('/1/oembed', compose([
  setupParams,
  scrape
])))

function *setupParams(next) {
  const params = defaults(extend({}, this.query), {width: 500, maxwidth: 500})
  params.url = encodeURI(decodeURIComponent(params.url))
  this.state.params = params
  yield *next
}

function *scrape(next) {
  let data = clone(this.state.params)

  data = preprocess(validate(data))

  let [gdoc, embedlyData] = yield [
    gdocs.process(data),
    embedly.process(data)
  ]

  data = gdoc ? gdoc : extend(embedlyData, docPreview(data))

  if(isImage(data))
    data.image = yield upload(data.url)
  if(data.thumbnail_url)
    data.thumbnail_url = yield upload(data.thumbnail_url)

  this.body = data

  yield *next
}

function isImage(data) {
  return data.type === 'image' || data.type === 'photo'
}

function *upload (source) {
  let buffer = yield toBuffer(source)
  buffer = yield normalizeImage(buffer)
  const res = yield s3upload(buffer)
  return res && res.req.url
}