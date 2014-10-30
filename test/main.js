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
  this.timeout(5000);

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

      // This url base64 encodes with an _ in it
      scrape(base64.encode('https://www.youtube.com/watch?v=3sKdDyyanGk', true), function(err, res) {
        var data = res.body;
        expect(err).to.be.falsy;
        expect(data.url).to.equal('http://www.youtube.com/watch?v=3sKdDyyanGk');
        done();
      });
    });
  });

  it('should handle youtube urls specially', function(done) {
    scrape('https://www.youtube.com/watch?v=bXSQ-OXExCA&list=UUZff37s8JCOCojOY1IM-G2Q', function(err, res) {
      var data = res.body;
      expect(data.html).to.equal('<iframe width="500" height="" src="//www.youtube.com/embed/bXSQ-OXExCA?autoplay=0" frameborder="0" allowfullscreen></iframe>');
      done();
    });
  });

  it('should decode google images urls', function(done) {
    scrape('http://www.google.com/imgres?imgurl=http%3A%2F%2Fi.ytimg.com%2Fvi%2FYviYufXRw0g%2Fmaxresdefault.jpg&imgrefurl=http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DYviYufXRw0g&h=718&w=1280&tbnid=oQ6OkIAIzadjMM%3A&zoom=1&docid=MsLvkkBObh3yAM&ei=_59RVNz0MNizoQTTsILwBg&tbm=isch&ved=0CC4QMygBMAE&iact=rc&uact=3&dur=300&page=1&start=0&ndsp=24'
      , function(err, res) {
        expect(err).to.be.falsy;
        expect(res.body.url).to.equal('http://i.ytimg.com/vi/YviYufXRw0g/maxresdefault.jpg');
        done();
      });
  });
});