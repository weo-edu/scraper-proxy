var expect = require('chai').expect;
var gdocs = require('../lib/google-docs');
var app = require('../');
var request = require('supertest')(app);

describe('main', function() {
  var docUrl = 'https://docs.google.com/document/d/1DUH6nU7FnIVB3SSq8YIQ4xAdjUeGP9o5tAcU97mRUJk/edit?usp=sharing';

  it('document scrape', function(done) {
    request
      .get('/1/oembed?url=' + encodeURIComponent(docUrl))
      .end(function(err, res) {
        var data = res.body;
        expect(data.thumbnail_url).to.not.be.falsy;
        expect(data.title).to.equal('Testing Public Document WEO');
        expect(data.html).to.equal('<iframe src="https://docs.google.com/document/d/1DUH6nU7FnIVB3SSq8YIQ4xAdjUeGP9o5tAcU97mRUJk/preview"></iframe>');
        done();
      });
  })
})