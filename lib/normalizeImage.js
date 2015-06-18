/**
 * Modules
 */
import gm from 'gm'
import thunkify from 'thunkify'
import {maxImageWidth} from './config'

/**
 * Takes a Buffer representation of an image, and normalizes it
 * according to our standards (e.g. dimensions), and returns a
 * normalized Buffer representation of the image
 */
function normalizeImage(buffer, cb) {
  gm(buffer)
    .resize(maxImageWidth, null, '>')
    .toBuffer((err, outBuffer) => {
      err ? cb(err) : cb(null, outBuffer)
    })
}

export default thunkify(normalizeImage)