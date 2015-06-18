/**
 * Modules
 */
import gm from 'gm'
import {maxImageWidth} from './config'

/**
 * Takes a Buffer representation of an image, and normalizes it
 * according to our standards (e.g. dimensions), and returns a
 * normalized Buffer representation of the image
 */
export default function(buffer, cb) {
  gm(buffer)
    .resize(maxImageWidth, null, '>')
    .toBuffer((err, outBuffer) => {
      err ? cb(err) : cb(null, outBuffer)
    })
}