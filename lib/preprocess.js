/**
 * Modules
 */
import url from 'url'
import qs from 'qs'

/**
 * Preprocess a url to transform certain types of links
 * (e.g. google images urls)
 */
export default function (params) {
  const {hostname, pathname, search} = url.parse(params.url)

  if (hostname === 'google.com' || hostname === 'www.google.com') {
    if (pathname === '/imgres') {
      const {imgurl} = qs.parse(search.slice(1))
      if (imgurl)
        params.url = imgurl
    }
  }

  return params
}
