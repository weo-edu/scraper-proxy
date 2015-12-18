/**
 * Imports
 */

import request from './request'
import urlLib from 'url'

/**
 * Constants
 */

const htmlTypes = ['text/html', 'plain/html']
const imageTypes = ['image/jpeg', 'image/pjpeg', 'image/x-jps']

/**
 * Classify a link according to its mime type
 */

function *classify (data) {
  const res = yield headRequest(data.url)
  const mime = res.headers['content-type']

  if (!mime || isHtml(mime)) {
    data.type = 'link'
  } else if (isImage(mime)) {
    data.type = 'image'
  } else {
    data.type = 'file'
  }

  return data
}

/**
 * We have to do this special headRequest wrapper
 * because superagent sucks at following redirects
 * for head requests for some reason
 */

function *headRequest (url) {
  let res
  let method = 'head'

  for (let i = 0; i < 3; i++) {
    try {
      res = yield request[method](url)
    } catch (e) {
      // Method not allowed
      if (e.status === 405) {
        method = 'get'
        continue
      }

      if (isRedirect(e.status)) {
        url = urlLib.resolve(url, e.response.headers.location)
      } else {
        break
      }
    }
  }

  return res
}

function isRedirect (code) {
  return [301, 302, 303, 305, 307, 308].indexOf(code) !== -1
}

/**
 * Decide whether a mime-type is webpage-like
 */

function isHtml (mimeType) {
  const type = mimeType.split(';')[0]
  return htmlTypes.indexOf(type) !== -1
}

/**
 * Decide whether a mime-tyep is image-like
 */

function isImage (mimeType) {
  return mimeType.indexOf('image/') === 0 && mimeType !== 'image/x-icon' && mimeType !== 'image/vnd.microsoft.icon'
}

/**
 * Exports
 */

export default classify
