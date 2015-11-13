/**
 * Config
 */

export default {
  embedlyApiKey: process.env.EMBEDLY_API_KEY,
  googleDriveApiKey: process.env.GOOGLE_DRIVE_API_KEY,
  pinterestApiKey: process.env.PINTEREST_API_KEY,
  port: process.env.PORT || 5000,
  maxImageWidth: process.env.MAX_IMAGE_WIDTH || 1000,
  s3: {
    key: process.env.SCRAPER_S3_API_KEY,
    secret: process.env.SCRAPER_S3_SECRET,
    bucket: process.env.SCRAPER_S3_BUCKET,
    region: process.env.SCRAPER_S3_REGION
  }
}
