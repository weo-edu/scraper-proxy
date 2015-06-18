/**
 * Modules
 */
var gm = require('gm')
var config = require('./config')

/**
 * Takes a Buffer representation of an image, and normalizes it
 * according to our standards (e.g. dimensions), and returns a
 * normalized Buffer representation of the image
 */
function normalizeImage(buffer, cb) {
  gm(buffer)
    .resize(config.maxImageWidth, null, '>')
    .toBuffer(function(err, outBuffer) {
      if(err) return cb(err)
      cb(null, outBuffer)
    })
}

/**
 * Exports
 */
module.exports = normalizeImage