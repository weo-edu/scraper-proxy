/**
 * Global error handling express middleware
 */
export default function *(next) {
  try {
    yield *next
  } catch(e) {
    console.log('err', e, e.stack)
    this.status = e.code || e.error_code || 500
    this.body = e
  }
}