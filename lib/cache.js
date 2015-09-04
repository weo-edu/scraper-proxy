/**
 * Imports
 */

import compose from 'koa-compose'
import cash from 'koa-cash'
import lru from 'lru-cache'

/**
 * Response caching
 */

function cacher() {
  const cache = lru({maxAge: 60*60*24})

  return compose(
    [
      cash({
       get: function *(key, maxAge) {
         return cache.get(key)
       },
       set: function *(key, value) {
         cache.set(key, value)
       }
      }),
      function *(next) {
        if (yield *this.cashed())
          return
        yield next
      }
    ]
  )
}

/**
 * Exports
 */

export default cacher