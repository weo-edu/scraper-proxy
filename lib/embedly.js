/**
 * Imports
 */

import {embedlyApiKey} from './config'
import thunkify from 'thunkify'
import Embedly from 'embedly'
import {clone} from 'lodash'

/**
 * Vars
 */

let api

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
