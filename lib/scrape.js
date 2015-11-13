/**
 * Imports
 */

import {defaults, clone} from 'lodash'
import compose from 'koa-compose'
import validate from './validate'
import preprocess from './preprocess'
import gdocs from './google-docs'
import embedly from './embedly'
import documentPreview from './document-preview'
import uploadImages from './uploadImages'
import classify from './classify'
import {putFile} from './drive'
import pinterest from './pinterest'
import youtube from './youtube'

/**
 * Scrape a link
 */

function *scrape (next) {
  let data = preprocess(validate(getParams(this.query)))

  yield classify(data)

  const gdoc = gdocs(data)
  const yt = yield youtube(data)
  const doc = documentPreview(data)

  if (gdoc) data = gdoc
  else if (doc) data = doc
  else if (yt) data = yt
  else if (!(yield pinterest(data)) && data.type !== 'image' && data.type !== 'file') {
    data = yield embedly.process(data)
  }

  data = yield uploadImages(data)

  this.body = data
  yield *next
}

/**
 * Normalize query parameters
 */

function getParams (query) {
  const params = defaults(clone(query), {width: 500, maxwidth: 500})
  params.url = encodeURI(decodeURIComponent(params.url))
  return params
}

/**
 * Exports
 */

export default scrape
