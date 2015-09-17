/**
 * Imports
 */

import path from 'path'
import uuid from 'uuid'
import knox from 'knox'
import thunkify from 'thunkify'
import {s3} from './config'

/**
 * Vars
 */

const s3client = knox.createClient(s3)
const opts = {'x-amz-acl': 'public-read'}

/**
 * Upload a buffer to s3
 */

function s3upload (buffer, contentType, cb) {
  if (arguments.length === 2) {
    cb = contentType
    contentType = 'binary/octet-stream'
  }

  const dest = path.join('uploads', uuid.v4())
  s3client.putBuffer(buffer, dest, {...opts, 'Content-Type': contentType}, cb)
}

/**
 * Exports
 */

export default thunkify(s3upload)
