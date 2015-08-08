/**
 * Imports
 */
import * as gdocs from './google-docs'
import * as embedly from './embedly'

/**
 * Setup
 */
function *setup (next) {
  yield embedly.prepare()
  yield gdocs.prepare()
  yield *next
}

/**
 * Exports
 */
export default setup