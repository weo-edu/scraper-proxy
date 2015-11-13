/**
 * Imports
 */

import validator from 'validator'

/**
 * Check whether or not we received a validate URL
 */

function validate (params) {
  if(! validator.isURL(params.url)) {
    console.log('Invalid URL: ', params.url)
    const err = new Error('Invalid URL')
    err.code = 400
    throw err
  }

  return params
}

/**
 * Exports
 */

export default validate
