/**
 * Imports
 */

import request from './request'

/**
 * Constants
 */

const htmlTypes = ['text/html', 'plain/html']
const imageTypes = ['image/jpeg', 'image/pjpeg', 'image/x-jps']

/**
 * Decide whether a link should be treated as a file
 */

function *linkOrFile (data) {
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

  for (let i = 0; i < 3; i++) {
    try {
      res = yield request.head(url)
    } catch (e) {
      if (isRedirect(e.status)) {
        res = yield request.head(e.response.headers.location)
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
  return mimeType.indexOf('image/') === 0
}

/**
 * Exports
 */

export default linkOrFile
