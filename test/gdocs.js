var expect = require('chai').expect
var app = require('../')
var request = require('supertest')(app)

function scrape (url, cb) {
  request
    .get('/1/oembed?url=' + encodeURIComponent(url))
    .end(cb)
}

describe('google docs', function () {
  this.timeout(5000)

  var pdfUrl = 'https://docs.google.com/file/d/1rNGkMLyovbD5vfx8QYMCweJJzm9BQPEo6-op4P20sA2K9P-_oH1_XD9N58MM/edit?usp=sharing'
  var docUrl = 'https://docs.google.com/document/d/1DUH6nU7FnIVB3SSq8YIQ4xAdjUeGP9o5tAcU97mRUJk/edit?usp=sharing'

  it('should work with normal docs', function (done) {
    scrape(docUrl, function (err, res) {
      var data = res.body
      expect(err).to.be.null
      expect(data.thumbnail_url).to.not.be.falsy
      expect(data.title).to.equal('Testing Public Document WEO')
      expect(data.html).to.equal('<iframe src="https://docs.google.com/document/d/1DUH6nU7FnIVB3SSq8YIQ4xAdjUeGP9o5tAcU97mRUJk/preview"></iframe>')
      done()
    })
  })

  it('should work with pdfs', function (done) {
    scrape(pdfUrl, function (err, res) {
      var data = res.body
      expect(err).to.be.null
      expect(data.thumbnail_url).to.not.be.falsy
      expect(data.title).to.equal('vidsheet exponents.pdf')
      expect(data.html).to.equal('<iframe src="https://docs.google.com/file/d/1rNGkMLyovbD5vfx8QYMCweJJzm9BQPEo6-op4P20sA2K9P-_oH1_XD9N58MM/edit?usp=drivesdk"></iframe>')
      done()
    })
  })
})
