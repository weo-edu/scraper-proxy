/**
 * Imports
 */

import superagent from 'superagent'
import superagentAsPromised from 'superagent-as-promised'

/**
 * Request
 */

const request = superagentAsPromised(superagent)

/**
 * Exports
 */

export default request
