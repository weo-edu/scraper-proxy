/**
 * Imports
 */

import googleapis from 'googleapis'
import {googleDriveApiKey} from './config'
import thunkify from 'thunkify'

/**
 * Vars
 */

let client

/**
 * Google drive
 */

function prepare (cb) {
  if (client) return cb()

  googleapis
    .discover('drive', 'v2')
    .execute((err, _client) => {
      client = _client
      cb(err)
    })
}

function getFile (id, cb) {
  client.drive.files
    .get({fileId: id})
    .withApiKey(googleDriveApiKey)
    .execute(cb)
}

function putFile (title, type, file, cb) {
  client.drive.files
    .insert({
      resource: {
        title: title,
        mimeType: type
      },
      media: {
        mimeType: type,
        body: file
      }
    })
    .withApiKey(googleDriveApiKey)
    .execute(cb)
}

/**
 * Exports
 */

export default {prepare, getFile, putFile}
