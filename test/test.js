/**
 * Modules
 */
import {expect} from 'chai'
import gdocs from '../lib/google-docs'
import app from '..'
import supertest from 'supertest'

/**
 * Vars
 */
const request = supertest(app)
const docUrl = 'https://docs.google.com/document/d/1DUH6nU7FnIVB3SSq8YIQ4xAdjUeGP9o5tAcU97mRUJk/edit?usp=sharing'
const pdfUrl = 'https://docs.google.com/file/d/1rNGkMLyovbD5vfx8QYMCweJJzm9BQPEo6-op4P20sA2K9P-_oH1_XD9N58MM/edit?usp=sharing'

function scrape (url, cb) {
  request
    .get('/1/oembed?url=' + encodeURIComponent(url))
    .end(cb)
}

describe('main', function() {
  this.timeout(5000)

  it('document scrape', (done) => {
    scrape(docUrl, (err, res) => {
      const data = res.body
      expect(data.thumbnail_url).to.not.be.falsy
      expect(data.title).to.equal('Testing Public Document WEO')
      expect(data.html).to.equal('<iframe src="https://docs.google.com/document/d/1DUH6nU7FnIVB3SSq8YIQ4xAdjUeGP9o5tAcU97mRUJk/preview"></iframe>')
      done()
    })
  })

  it('should handle youtube urls specially', (done) => {
    scrape('https://www.youtube.com/watch?v=bXSQ-OXExCA&list=UUZff37s8JCOCojOY1IM-G2Q', (err, res) => {
      const data = res.body
      expect(data.html).to.equal('<iframe width="500" height="" src="//www.youtube.com/embed/bXSQ-OXExCA?autoplay=0" frameborder="0" allowfullscreen></iframe>')
      done()
    })
  })

  it('should decode google images urls', (done) => {
    scrape('http://www.google.com/imgres?imgurl=http%3A%2F%2Fi.ytimg.com%2Fvi%2FYviYufXRw0g%2Fmaxresdefault.jpg&imgrefurl=http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DYviYufXRw0g&h=718&w=1280&tbnid=oQ6OkIAIzadjMM%3A&zoom=1&docid=MsLvkkBObh3yAM&ei=_59RVNz0MNizoQTTsILwBg&tbm=isch&ved=0CC4QMygBMAE&iact=rc&uact=3&dur=300&page=1&start=0&ndsp=24'
      , (err, res) => {
        expect(err).to.be.falsy
        expect(res.body.url).to.equal('http://i.ytimg.com/vi/YviYufXRw0g/maxresdefault.jpg')
        done()
      })
  })

  it('should not consider single-letter urls valid', (done) => {
    scrape('ab', (err, res) => {
      expect(res.status).to.equal(400)
      done()
    })
  })
})

describe('google docs', function() {
  this.timeout(5000)

  it('should work with normal docs', (done) => {
    scrape(docUrl, (err, res) => {
      const data = res.body
      expect(err).to.be.null
      expect(data.thumbnail_url).to.not.be.falsy
      expect(data.title).to.equal('Testing Public Document WEO')
      expect(data.html).to.equal('<iframe src="https://docs.google.com/document/d/1DUH6nU7FnIVB3SSq8YIQ4xAdjUeGP9o5tAcU97mRUJk/preview"></iframe>')
      done()
    })
  })

  it('should work with pdfs', (done) => {
    scrape(pdfUrl, (err, res) => {
      const data = res.body
      expect(err).to.be.null
      expect(data.thumbnail_url).to.not.be.falsy
      expect(data.title).to.equal('vidsheet exponents.pdf')
      expect(data.html).to.equal('<iframe src="https://drive.google.com/file/d/1rNGkMLyovbD5vfx8QYMCweJJzm9BQPEo6-op4P20sA2K9P-_oH1_XD9N58MM/edit?usp=drivesdk"></iframe>')
      done()
    })
  })
})
