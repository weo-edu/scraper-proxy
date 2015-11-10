/**
 * Imports
 */

import {template} from 'lodash'
import url from 'url'
import joinUrl from 'url-join'
import path from 'path'
import _debug from 'debug'

/**
 * Vars
 */

const docExts = ['.docx', '.ppt', '.doc', '.gdoc', '.pdf']
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
 * Check if a given link is a document that we can preview,
 * and if so gennerate the link for the thumbnail preview
 */

export default function (params) {
  if (! isDocument(params.url))
    return

  return {
    html: template(embedLinkTmpl, {src: params.url}),
    type: 'document'
  }
}

