var _ = require('lodash')
  , knox = require('knox')
  , Stream = require('stream')
  , path = require('path')
  , uuid = require('uuid')
  , request = require('superagent')
  , s3client = knox.createClient({
    key: "AKIAJGRZMUAG422PORVQ",
    secret: "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",
    bucket: 'dev.eos.io',
    region: 'us-west-1'
  });

function uploadStream(data, dest, opts, cb) {
  var bufs = [];
  data.on('data', function(data) { bufs.push(data); })
    .on('error', cb)
    .on('end', function() {
      uploadBuffer(Buffer.concat(bufs), dest, opts, cb);
    });
}

function uploadBuffer(data, dest, opts, cb) {
  s3client.putBuffer(data, dest, opts, cb);
}



function upload(data, dest, opts, cb) {
  if(data instanceof Stream) {
    uploadStream(data, dest, opts, cb);
  } else if(data instanceof Buffer) {
    uploadBuffer(data, dest, opts, cb);
  } else {
    throw new Error('unsupported data format');
  }
}


function fromUrl(url, dest, opts, cb) {
  request
    .get(url)
    .end(function(err, res) {
      if(err) return cb(err);
      _.defaults(opts, {
        'Content-Type': res.headers['content-type']
      });

      upload(res, dest, opts, cb);
    });
}

function task(url, cb) {
  fromUrl(url, path.join('uploads', uuid.v4()), {
    'x-amz-acl': 'public-read'
  }, cb);
}

module.exports = {
  upload: upload,
  fromUrl: fromUrl,
  task: task
};