/**
 * Imports
 */

import sharp from 'sharp'
import thunkify from 'thunkify'
import {maxImageWidth} from './config'

/**
 * Takes a Buffer representation of an image, and normalizes it
 * according to our standards (e.g. dimensions), and returns a
 * normalized Buffer representation of the image
 */

function normalizeImage (buffer, cb) {
  return sharp(buffer)
    .resize(maxImageWidth)
    .withoutEnlargement()
    .quality(100)
    .toBuffer(cb)
}

/**
 * Exports
 */

export default thunkify(normalizeImage)
