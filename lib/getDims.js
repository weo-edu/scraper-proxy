/**
 * Imports
 */

import sharp from 'sharp'
import {maxImageWidth} from './config'
import thunkify from 'thunkify'

/**
 * Takes a Buffer representation of an image, and returns its dimensions
 */

function getDims (buffer, cb) {
  return sharp(buffer).metadata(cb)
}

/**
 * Exports
 */

export default thunkify(getDims)
