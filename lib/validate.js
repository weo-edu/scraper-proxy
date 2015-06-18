/**
 * Modules
 */
import validator from 'validator'

/**
 * Check whether or not we received a validate URL
 */
export default function (params) {
  const valid = validator.isURL(params.url)
  const err = valid ? null : {error: 'Invalid URL', code: 400}
  this(err, params)
}
