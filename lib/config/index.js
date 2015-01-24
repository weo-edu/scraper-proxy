module.exports = {
  docthumbUrl: process.env.DOCTHUMB_URL || '',
  embedlyApiKey: '578f2e0b9cb04763888f0a6c9b907b55',
  googleDriveApiKey: 'AIzaSyDCntpE09OxvK4vTsCTMlUKI-wlMi3H3SI',
  port: process.env.PORT || 5000,
  s3: {
    key: "AKIAJGRZMUAG422PORVQ",
    secret: "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",
    bucket: 'dev.eos.io',
    region: 'us-west-1'
  }
};