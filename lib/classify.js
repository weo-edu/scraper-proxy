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
  const res = yield request.head(data.url)
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
