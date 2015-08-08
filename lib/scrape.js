/**
 * Imports
 */
import {defaults, clone, extend} from 'lodash'
import compose from 'koa-compose'
import validate from './validate'
import preprocess from './preprocess'
import gdocs from './google-docs'
import embedly from './embedly'
import docPreview from './document-preview'
import uploadImages from './uploadImages'
import linkOrFile from './linkOrFile'

/**
 * Scrape a link
 */
function *scrape (next) {
  let data = preprocess(validate(getParams(this.query)))
  let [gdoc, embedlyData] = yield [
    gdocs.process(data),
    embedly.process(data)
  ]

  data = gdoc ? gdoc : extend(embedlyData, docPreview(data))
  data = yield uploadImages(data)
  data = yield linkOrFile(data)

  this.body = data
  yield *next
}

/**
 * Normalize query parameters
 */
 function getParams(query) {
   const params = defaults(clone(query), {width: 500, maxwidth: 500})
   params.url = encodeURI(decodeURIComponent(params.url))
   return params
 }

/**
 * Exports
 */
export default scrape
