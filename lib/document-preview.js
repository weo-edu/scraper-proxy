/**
 * Imports
 */

import url from 'url'
import path from 'path'

/**
 * Constants
 */

const docExts = ['.docx', '.ppt', '.doc', '.gdoc', '.pdf']

/**
 * Check if a link points at a document that we can preview
 */

function isDocument (href) {
  const parsed = url.parse(href)
  const ext = path.extname(parsed.pathname).split('?')[0]
  return docExts.indexOf(ext) !== -1
}

function template (url) {
  return `<iframe src="https://drive.google.com/viewerng/viewer?url=${url}&embedded=true"></iframe>`
}

/**
 * Check if a given link is a document that we can preview,
 * and if so gennerate the link for the thumbnail preview
 */

export default function (params) {
  if (! isDocument(params.url))
    return

  return {
    html: template(params.url),
    type: 'document'
  }
}
