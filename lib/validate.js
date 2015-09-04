/**
 * Imports
 */

import validator from 'validator'

/**
 * Check whether or not we received a validate URL
 */

export default function (params) {
  if(! validator.isURL(params.url)) {
    const err = new Error('Invalid URL')
    err.code = 400
    throw err
  }

  return params
}
