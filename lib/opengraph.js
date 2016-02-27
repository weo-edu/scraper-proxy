/**
 * Imports
 */

import dom from './dom'
import extract from '@f/extract-opengraph'

/**
 * Extract OpenGraph metadata
 */

function *og (url) {
  const wnd = yield dom(url)
  const meta = extract(wnd)

  // Free the window memory
  wnd.close()

  return {
    url,
    thumbnail_url: meta.image,
    title: meta.title,
    description: meta.description,
    type: 'link'
  }
}

/**
 * Exports
 */

export default og
