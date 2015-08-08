/**
 * Imports
 */
import {template, clone} from 'lodash'
import thunkify from 'thunkify'
import Embedly from 'embedly'
import {embedlyApiKey} from './config'

/**
 * Vars
 */
const embedTmpl = '<iframe width="<%= width %>" height="<%= height %>" src="//www.youtube.com/embed/<%= videoId %>?autoplay=<%= autoplay %>" frameborder="0" allowfullscreen></iframe>'
let api

/**
 * Parse the ids out of a youtube link
 */
function youtubeParser (url) {
  if (! url) return

  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
  const match = url.match(regExp)
  if (match && match[7].length === 11)
    return match[7]
}

/**
 * Setup our embedly api client
 */
function prepare (cb) {
  if (api) return cb()

  new Embedly({key: embedlyApiKey}, (err, _api) => {
    api = _api
    cb(err)
  })
}

/**
 * Take in a link and set of embedly parameters, and get
 * the embedly data from it (with a little special processing
 * of our own for youtube links)
 */
function process (params, cb) {
  api.oembed(clone(params), (err, objs) => {
    let data

    if (! err && objs && objs[0]) {
      data = objs[0]
      if (data.error_code) {
        err = data
      } else if (data.provider_name === 'YouTube' && data.html) {
        data.html = template(embedTmpl, {
          width: params.width,
          height: params.height,
          videoId: youtubeParser(data.url),
          autoplay: params.autoplay ? 1 : 0
        })
      }
    }

    if (err) console.log('embedly err', err, objs)
    cb(err, data)
  })
}

/**
 * Exports
 */
export default {
  prepare: thunkify(prepare),
  process: thunkify(process)
}