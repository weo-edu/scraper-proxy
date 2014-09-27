var expect = require('chai').expect;
var gdocs = require('../lib/google-docs');
var app = require('../');
var request = require('supertest')(app);
var base64 = require('js-base64').Base64;

function scrape(url, cb) {
  request
    .get('/1/oembed?url=' + encodeURIComponent(url))
    .end(cb);
}

describe('main', function() {
  var docUrl = 'https://docs.google.com/document/d/1DUH6nU7FnIVB3SSq8YIQ4xAdjUeGP9o5tAcU97mRUJk/edit?usp=sharing';

  it('document scrape', function(done) {
    scrape(docUrl, function(err, res) {
      var data = res.body;
      expect(data.thumbnail_url).to.not.be.falsy;
      expect(data.title).to.equal('Testing Public Document WEO');
      expect(data.html).to.equal('<iframe src="https://docs.google.com/document/d/1DUH6nU7FnIVB3SSq8YIQ4xAdjUeGP9o5tAcU97mRUJk/preview"></iframe>');
      done();
    });
  });

  it('should accept base64 encoded urls', function(done) {
    scrape(base64.encode(docUrl), function(err, res) {
      var data = res.body;
      expect(data.thumbnail_url).to.not.be.falsy;
      expect(data.title).to.equal('Testing Public Document WEO');
      expect(data.html).to.equal('<iframe src="https://docs.google.com/document/d/1DUH6nU7FnIVB3SSq8YIQ4xAdjUeGP9o5tAcU97mRUJk/preview"></iframe>');
      done();
    });
  });

  it('should handle youtube urls specially', function(done) {
    scrape('https://www.youtube.com/watch?v=bXSQ-OXExCA&list=UUZff37s8JCOCojOY1IM-G2Q', function(err, res) {
      var data = res.body;
      expect(data.html).to.equal('<iframe width="500" height="" src="//www.youtube.com/embed/bXSQ-OXExCA" frameborder="0" allowfullscreen></iframe>');
      done();
    });
  });
});