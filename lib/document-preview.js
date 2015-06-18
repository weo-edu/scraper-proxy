/**
 * Modules
 */
import {template} from 'lodash'
import url from 'url'
import path from 'path'
import {docthumbUrl} from './config'
import _debug from 'debug'

/**
 * Vars
 */
const docExts = ['.docx', '.ppt', '.doc', '.gdoc', '.pdf']
const previewTmpl = docthumbUrl + '/?url=<%= url %>&width=<%= width %>'
const embedLinkTmpl = '<iframe src="https://drive.google.com/viewerng/viewer?url=<%= src %>&embedded=true"></iframe>'
const debug = _debug('scraper:document-preview')

/**
 * Check if a link points at a document that we can preview
 */
function isDocument (href) {
  const parsed = url.parse(href)
  const ext = path.extname(parsed.pathname).split('?')[0]
  return docExts.indexOf(ext) !== -1
}

/**
 * Generate the preview image url
 */
export function getLink (params) {
  return template(previewTmpl, {
    url: encodeURIComponent(params.url),
    width: params.width || 500
  })
}

/**
 * Check if a given link is a document that we can preview,
 * and if so gennerate the link for the thumbnail preview
 */
export default function (params) {
  if (! isDocument(params.url))
    return this()

  this(null, {
    thumbnail_url: getLink(params),
    html: template(embedLinkTmpl, {src: params.url}),
    type: 'document'
  })
}