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
        params.url = encodeURI(decodeURIComponent(imgurl))
    } else if(pathname === '/url') {
      const {url} = qs.parse(search.slice(1))
      if(url)
        params.url = encodeURI(decodeURIComponent(url))
    }
  }

  return params
}
