module.exports = {
  docthumbUrl: process.env.DOCTHUMB_URL,
  embedlyApiKey: process.env.EMBEDLY_API_KEY,
  googleDriveApiKey: process.env.GOOGLE_DRIVE_API_KEY,
  port: process.env.PORT || 5000,
  maxImageWidth: process.env.MAX_IMAGE_WIDTH || 1000,
  s3: {
    key: process.env.S3_API_KEY,
    secret: process.env.S3_SECRET,
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION
  }
}
