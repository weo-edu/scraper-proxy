/**
 * Imports
 */
import normalizeImage from './normalizeImage'
import s3upload from './s3'
import toBuffer from './toBuffer'


/**
 * Upload images (thumbnail / main image)
 */
function *uploadImages (data) {
  if (isImage(data)) {
    data.image = yield upload(data.url)
  }

  if (data.thumbnail_url) {
    data.thumbnail_url = yield upload(data.thumbnail_url)
  }

  return data
}

function isImage (data) {
  return data.type === 'image' || data.type === 'photo'
}

function *upload (source) {
  let buffer = yield toBuffer(source)
  buffer = yield normalizeImage(buffer)
  const res = yield s3upload(buffer)
  return res && res.req.url
}

/**
 * Exports
 */
export default uploadImages