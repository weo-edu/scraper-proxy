/**
 * Imports
 */

import {template, clone} from 'lodash'
import thunkify from 'thunkify'
import Embedly from 'embedly'
import {embedlyApiKey} from './config'
import superagent from 'superagent'
import superagentAsPromised from 'superagent-as-promised'

/**
 * Vars
 */

const request = superagentAsPromised(superagent)
const embedTmpl = '<iframe width="<%= width %>" height="<%= height %>" src="//www.youtube.com/embed/<%= videoId %>?autoplay=<%= autoplay %>&showinfo=0&rel=0" frameborder="0" allowfullscreen></iframe>'
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
        const videoId = youtubeParser(data.url)

        data.html = template(embedTmpl, {
          width: params.width,
          height: params.height,
          autoplay: params.autoplay ? 1 : 0,
          videoId
        })

        const thumb = `http://i1.ytimg.com/vi/${videoId}/maxresdefault.jpg`
        return request
          .head(thumb)
          .then(function () {
            data.thumbnail_url = thumb
            cb(null, data)
          }, function () {
            data.thumbnail_url = `http://i1.ytimg.com/vi/${videoId}/mqdefault.jpg`
            cb(null, data)
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