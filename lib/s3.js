var path = require('path')
var uuid = require('uuid')
var s3client = require('knox').createClient(require('./config').s3)

function upload (buffer, cb) {
  var dest = path.join('uploads', uuid.v4())
  var opts = {'x-amz-acl': 'public-read'}

  s3client.putBuffer(buffer, dest, opts, cb)
}

module.exports = upload