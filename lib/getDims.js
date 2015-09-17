/**
 * Imports
 */

import gm from 'gm'
import thunkify from 'thunkify'
import {maxImageWidth} from './config'

/**
 * Takes a Buffer representation of an image, and returns its dimensions
 */

function getDims (buffer, cb) {
  gm(buffer)
    .identify(function(err, value) {
      err ? cb(err) : cb(null, value)
    })
}

/**
 * Exports
 */

export default thunkify(getDims)
