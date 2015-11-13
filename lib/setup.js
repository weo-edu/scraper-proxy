/**
 * Imports
 */

import * as embedly from './embedly'

/**
 * Setup
 */

function *setup (next) {
  yield embedly.prepare()
  yield *next
}

/**
 * Exports
 */

export default setup
