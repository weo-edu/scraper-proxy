/**
 * Modules
 */
import {extend, template} from 'lodash'
import googleapis from 'googleapis'
import * as docPreview from './document-preview'
import Seq from 'seq'
import {googleDriveApiKey} from './config'

/**
 * Vars
 */
const gdocRe1 = /^(?:https?\:\/\/)?(?:docs|drive)\.google\.com\/([a-zA-Z\-\_]+)\/d\/([a-zA-Z0-9\-\_]+)\/?/
const gdocRe2 = /^(?:https?\:\/\/)?(?:docs|drive)\.google\.com\/([a-zA-Z\-\_]+)\/ccc.*(?:(?:\?key=)|(?:\&key=))([a-zA-Z0-9\-\_]+)\&?/
const gdocRes = [gdocRe1, gdocRe2]
const embedTmpl = '<iframe src="<%= src %>"></iframe>'
const providerUrl = 'http://docs.google.com'
let client

function parse (url) {
  for(let re of gdocRes) {
    if(re.test(url)) {
      const [, type, id] = re.exec(url)
      return {id, type}
    }
  }

  return false
}

export function prepare (cb) {
  if (client) return cb()

  googleapis.discover('drive', 'v2')
    .execute((err, _client) => {
      client = _client
      cb(err)
    })
}

export function process (params) {
  const data = parse(params.url)
  if (! data) return this()

  client.drive.files.get({fileId: data.id})
    .withApiKey(googleDriveApiKey)
    .execute((err, res) => {
      const data = {}

      if (res && ! res.errors) {
        if (! res.thumbnailLink)
          res.thumbnailLink = docPreview.getLink(extend({}, params, {url: res.webContentLink}))
        if (! res.embedLink)
          res.embedLink = res.alternateLink

        extend(data, {
          thumbnail_url: res.thumbnailLink && res.thumbnailLink.replace(/\=s\d+$/, '=w' + Math.min(params.width, params.maxwidth)),
          title: res.title,
          html: template(embedTmpl, {src: res.embedLink}),
          provider_url: providerUrl,
          type: 'document'
        })
      } else {
        err = err || {reason: (res && res.reason)}
        err.provider_url = providerUrl
      }

      this(err, data)
    })
}
