/**
 * Imports
 */

import documentPreview from './document-preview'
import uploadImages from './uploadImages'
import {defaults, clone} from 'lodash'
import preprocess from './preprocess'
import pixelbots from './pixelbots'
import pinterest from './pinterest'
import classify from './classify'
import compose from 'koa-compose'
import validate from './validate'
import gdocs from './google-docs'
import embedly from './embedly'
import {putFile} from './drive'
import youtube from './youtube'

/**
 * Scrape a link
 */

function *scrape (next) {
  let data = preprocess(validate(getParams(this.query)))

  const pbots = yield pixelbots(data)

  if (pbots) {
    data = pbots
  } else {
    yield classify(data)

    const gdoc = yield gdocs(data)
    const yt = yield youtube(data)
    const doc = yield documentPreview(data)

    if (gdoc) data = gdoc
    else if (doc) data = doc
    else if (yt) data = yt
    else if (!(yield pinterest(data)) && data.type !== 'image' && data.type !== 'file') {
      try {
        data = yield embedly.process(data)
      } catch (e) {
        // If embedly fails, its whatever
      }
    }

    data = yield uploadImages(data)
  }

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
