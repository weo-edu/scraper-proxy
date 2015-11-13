/**
 * Imports
 */

import {s3} from './config'
import normalizeImage from './normalizeImage'
import s3upload from './s3'
import sharp from 'sharp'
import toBuffer from './toBuffer'
import getDims from './getDims'


/**
 * Upload images (thumbnail / main image)
 */

function *uploadImages (data) {
  if (isImage(data)) {
    const {url, width, height} = yield upload(data.url)
    data.image = url
    data.width = width
    data.height = height
  }

  if (data.thumbnail_url) {
    const {url, width, height} = yield upload(data.thumbnail_url)
    data.thumbnail_url = url
    data.thumbnail_width = width
    data.thumbnail_height = height
  }

  return data
}

function isImage (data) {
  return data.type === 'image' || data.type === 'photo'
}

function *upload (source) {
  let buffer = yield toBuffer(source)
  buffer = yield normalizeImage(buffer)

  const {width, height, format} = yield getDims(buffer)

  let url = source
  if (source.indexOf(s3.bucket) === -1) {
    const res = yield s3upload(buffer, 'image/' + format.toLowerCase())
    url = res && res.req.url
  }

  return {
    url,
    width: width,
    height: height
  }
}

/**
 * Exports
 */

export default uploadImages
