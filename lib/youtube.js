/**
 * Imports
 */

import thunkify from 'thunkify'
import getYoutubeId from 'get-youtube-id'
import isYoutubeVideo from 'is-youtube-video'
import request from './request'

/**
 * Youtube
 */

function template (id, width = '', height = '', autoplay) {
  return `<iframe width="${width}" height="${height}" src="//www.youtube.com/embed/${id}?autoplay=${autoplay}&showinfo=0&rel=0" frameborder="0" allowfullscreen></iframe>`
}

function getThumb (id) {
  const thumb = `http://i1.ytimg.com/vi/${id}/maxresdefault.jpg`
  return request
    .head(thumb)
    .then(() => thumb, () => `http://i1.ytimg.com/vi/${id}/mqdefault.jpg`)
}

function youtube ({url, width, height, autoplay}, cb) {
  const data = {}

  if (isYoutubeVideo(url)) {
    const id = getYoutubeId(url)

    data.html = template(id, width, height, autoplay ? 1 : 0)
    data.type = 'video'
    data.provider_name = 'YouTube'
    data.provider_url = 'https://www.youtube.com/'

    getThumb(id).then(url => {
      data.thumbnail_url = url
      cb(null, data)
    })
  } else {
    cb(null, false)
  }
}

/**
 * Exports
 */

export default thunkify(youtube)
