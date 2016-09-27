/**
 * Global error handling express middleware
 */

export default function *(next) {
  try {
    yield *next
  } catch(e) {
    console.log('err', this.url, e, e.stack)
    this.status = e.code || e.error_code || 500
    this.body = e
  }
}
