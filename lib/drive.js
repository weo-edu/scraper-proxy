/**
 * Imports
 */

import googleapi from 'googleapis'
import key from './driveKey.json'
import thunkify from 'thunkify'
import {googleDriveApiKey} from './config'

/**
 * Vars
 */

let client
googleapi
  .discover('drive', 'v2')
  .execute((err, _client) => client = _client)
const scopes = [
  'https://www.googleapis.com/auth/drive'
]
const jwtClient = jwt(key, scopes)

jwtClient.authorize(function(err, _tokens) {
  if(err) return console.log(err)
})

/**
 * Drive
 */

function putFile (title, mimeType, body, cb) {
  client.drive.files
    .insert({
      resource: {title, mimeType},
      media: {mimeType, body}
    })
    .withAuthClient(jwtClient)
    .execute(cb)
}

function jwt (key, scopes) {
  return new googleapi.auth.JWT(key.client_email, null, key.private_key, scopes, null)
}

/**
 * Exports
 */

export default {
  putFile: thunkify(putFile)
}