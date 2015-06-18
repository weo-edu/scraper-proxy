/**
 * Global error handling express middleware
 */
export default function(err, req, res, next) {
  console.log('asdf')
  if (err) {
    if (err.code !== 400) console.log('err', err, err.stack)
    res.send(err.code || err.error_code || 500, err)
  } else
    next()
}