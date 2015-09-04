/**
 * Modules
 */
import * as assert from 'assert'
import gdocs from '../lib/google-docs'
import app from '../lib/main'
import supertest from 'supertest'
import thunkify from 'thunkify'

/**
 * Vars
 */
const request = supertest(app.listen())
const docUrl = 'https://docs.google.com/document/d/1DUH6nU7FnIVB3SSq8YIQ4xAdjUeGP9o5tAcU97mRUJk/edit?usp=sharing'
const pdfUrl = 'https://docs.google.com/file/d/1rNGkMLyovbD5vfx8QYMCweJJzm9BQPEo6-op4P20sA2K9P-_oH1_XD9N58MM/edit?usp=sharing'

const scrape = thunkify(function scrape (url, cb) {
  request
    .get('/1/oembed?url=' + encodeURIComponent(url))
    .end(cb)
})

describe('scraper', function() {
  this.timeout(5000)

  it('document scrape', function *() {
    const {body} = yield scrape(docUrl)
    assert.ok(body.thumbnail_url)
    assert.equal(body.title, 'Testing Public Document WEO')
    assert.equal(body.html, '<iframe src="https://docs.google.com/document/d/1DUH6nU7FnIVB3SSq8YIQ4xAdjUeGP9o5tAcU97mRUJk/preview"></iframe>')
  })

  it('should handle youtube urls specially', function *() {
    const {body} = yield scrape('https://www.youtube.com/watch?v=bXSQ-OXExCA&list=UUZff37s8JCOCojOY1IM-G2Q')
    assert.equal(body.html, '<iframe width="500" height="" src="//www.youtube.com/embed/bXSQ-OXExCA?autoplay=0&showinfo=0&rel=0" frameborder="0" allowfullscreen></iframe>')
  })

  it('should decode google images urls', function *() {
    const {body} = yield scrape('http://www.google.com/imgres?imgurl=http%3A%2F%2Fi.ytimg.com%2Fvi%2FYviYufXRw0g%2Fmaxresdefault.jpg&imgrefurl=http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DYviYufXRw0g&h=718&w=1280&tbnid=oQ6OkIAIzadjMM%3A&zoom=1&docid=MsLvkkBObh3yAM&ei=_59RVNz0MNizoQTTsILwBg&tbm=isch&ved=0CC4QMygBMAE&iact=rc&uact=3&dur=300&page=1&start=0&ndsp=24')
    assert.equal(body.url, 'http://i.ytimg.com/vi/YviYufXRw0g/maxresdefault.jpg')
  })

  it('should not consider single-letter urls valid', function *() {
    try {
      yield scrape('ab')
    } catch(e) {
      assert.equal(e.status, 400)
      return
    }

    throw new Error('Test failed')
  })

  it('should work with normal docs', function *() {
    const {body} = yield scrape(docUrl)
    assert.ok(body.thumbnail_url)
    assert.equal(body.title, 'Testing Public Document WEO')
    assert.equal(body.html, '<iframe src="https://docs.google.com/document/d/1DUH6nU7FnIVB3SSq8YIQ4xAdjUeGP9o5tAcU97mRUJk/preview"></iframe>')
  })

  it('should work with pdfs', function *() {
    const {body} = yield scrape(pdfUrl)
    assert.ok(body.thumbnail_url)
    assert.equal(body.title, 'vidsheet exponents.pdf')
    assert.equal(body.html, '<iframe src="https://drive.google.com/file/d/1rNGkMLyovbD5vfx8QYMCweJJzm9BQPEo6-op4P20sA2K9P-_oH1_XD9N58MM/view?usp=drivesdk"></iframe>')
  })

  it('should work on % encoded urls', function *() {
    const {body} = yield scrape('http://www.usd497.org/cms/lib8/KS01906981/Centricity/Domain/5043/Finn%20Jake%20Algebraic.jpg')
    assert.ok(body.image)
    assert.equal(body.type, 'photo')
  })

  it('should identify non-html links as files', function *() {
    const {body} = yield scrape('http://weo-uploads-dev.s3.amazonaws.com/uploads/55c532f00d2a29cddc677250E.md')
    assert.equal(body.type, 'file')
  })

  it('should identify html links as links', function *() {
    const {body} = yield scrape('https://www.google.com')
    assert.equal(body.type, 'link')
  })
})
