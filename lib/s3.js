/**
 * Modules
 */
import path from 'path'
import uuid from 'uuid'
import knox from 'knox'
import {s3} from './config'

/**
 * Vars
 */
const s3client = knox.createClient(s3)
const opts = {'x-amz-acl': 'public-read'}

/**
 * Upload a buffer to s3
 */
export default function (buffer, cb) {
  const dest = path.join('uploads', uuid.v4())
  s3client.putBuffer(buffer, dest, opts, cb)
}