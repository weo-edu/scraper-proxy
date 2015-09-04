/**
 * Imports
 */

import superagent from 'superagent'
import superagentAsPromised from 'superagent-as-promised'

/**
 * Vars
 */

const request = superagentAsPromised(superagent)
const htmlTypes = ['text/html', 'plain/html']

/**
 * Decide whether a link should be treated as a file
 */

function *linkOrFile (data) {
  if (data.type === 'link') {
    const res = yield request.head(data.url)
    const mime = res.headers['content-type']

    if (! mime || !isHtml(mime)) {
      data.type = 'file'
    }
  }

  return data
}

/**
 * Decide whether a mime-type is webpage-like
 */

function isHtml (mimeType) {
  const type = mimeType.split(';')[0]
  return htmlTypes.indexOf(type) !== -1
}

/**
 * Exports
 */

export default linkOrFile