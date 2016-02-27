/**
 * Imports
 */

import jsdom from 'jsdom'
import thunkify from 'thunkify'

/**
 * Exports
 */

export default thunkify(jsdom.env)
