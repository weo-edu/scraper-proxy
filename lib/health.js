/**
 * Health check
 */
function *healthCheck (next) {
  this.body = 'up'
  yield next
}

/**
 * Exports
 */
export default healthCheck
