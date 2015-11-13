/**
 * Imports
 */

import sharp from 'sharp'
import {maxImageWidth} from './config'

/**
 * Takes a Buffer representation of an image, and normalizes it
 * according to our standards (e.g. dimensions), and returns a
 * normalized Buffer representation of the image
 */

function normalizeImage (buffer) {
  return sharp(buffer)
    .resize(maxImageWidth)
    .withoutEnlargement()
    .quality(100)
    .toBuffer()
}

/**
 * Exports
 */

export default normalizeImage
