/**
 * Imports
 */

import sharp from 'sharp'
import {maxImageWidth} from './config'

/**
 * Takes a Buffer representation of an image, and returns its dimensions
 */

function getDims (buffer) {
  return sharp(buffer).metadata()
}

/**
 * Exports
 */

export default getDims
