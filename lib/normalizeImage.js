/**
 * Imports
 */

import gm from 'gm'
import sharp from 'sharp'
import thunkify from 'thunkify'
import {maxImageWidth} from './config'

/**
 * Takes a Buffer representation of an image, and normalizes it
 * according to our standards (e.g. dimensions), and returns a
 * normalized Buffer representation of the image
 */

function normalizeImage (buf, cb) {
  return normalizeSharp(buf, (err, out) => {
    if (err) toPng(buf, (err, out) => err ? cb(err) : normalizeSharp(out, cb))
    else cb(null, out)
  })
}

function normalizeSharp (buf, cb) {
  sharp(buf)
    .resize(maxImageWidth)
    .withoutEnlargement()
    .quality(100)
    .toBuffer(cb)
}

function toPng (buf, cb) {
  gm(buf)
    .setFormat('png')
    .toBuffer(cb)
}

/**
 * Exports
 */

export default thunkify(normalizeImage)
