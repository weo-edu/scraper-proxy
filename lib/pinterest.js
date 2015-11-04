/**
 * Imports
 */

import {pinterestApiKey} from './config'
import superagent from 'superagent'
import superagentAsPromised from 'superagent-as-promised'

/**
 * Constants
 */

const request = superagentAsPromised(superagent)

/**
 * Pinterest
 */

function *pinterest (data) {
  if (isPin(data.url)) {
    data.type = 'image'
    data.url = yield getPinImage(getPinId(data.url))
    return data
  } else if (isPinimg(data.url)) {
    data.type = 'image'
    return data
  }
}

function isPin (url) {
  return /^[^\?]*\.pinterest\.com\/pin\/.*/.test(url)
}

function getPinId (url) {
  return /pinterest\.com\/pin\/([0-9]+)\/?/.exec(url)[1]
}

function *getPinImage (id) {
  const url = `https://api.pinterest.com/v1/pins/${id}/?access_token=${pinterestApiKey}&fields=id%2Clink%2Cnote%2Curl%2Cimage`
  const res = yield request.get(url)
  return get(res.body, ['data', 'image', 'original', 'url'])
}

function get (o, path) {
  let p = o

  for (let i = 0; i < path.length; i++) {
    if (!p) return p
    p = p[path[i]]
  }

  return p
}

function isPinimg (url) {
  return /^[^\?]*\.pinimg\.com.*/.test(url)
}

/**
 * Exports
 */

export default pinterest
