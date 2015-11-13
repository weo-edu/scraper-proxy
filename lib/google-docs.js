/**
 * Constants
 */

const gdocRe1 = /^(?:https?\:\/\/)?(?:docs|drive)\.google\.com\/([a-zA-Z\-\_]+)\/d\/([a-zA-Z0-9\-\_]+)\/?/
const gdocRe2 = /^(?:https?\:\/\/)?(?:docs|drive)\.google\.com\/([a-zA-Z\-\_]+)\/ccc.*(?:(?:\?key=)|(?:\&key=))([a-zA-Z0-9\-\_]+)\&?/
const gdocRes = [gdocRe1, gdocRe2]
const embedTmpl = '<iframe src="<%= src %>"></iframe>'
const providerUrl = 'http://docs.google.com'

function parse (url) {
  for(let re of gdocRes) {
    if(re.test(url)) {
      const [, type, id] = re.exec(url)
      return {id, type}
    }
  }

  return false
}

function template (id) {
  return `<iframe src="https://docs.google.com/viewer?srcid=${id}&pid=explorer&efh=false&a=v&chrome=false&embedded=true"></iframe>`
}

function gdocs (params) {
  const data = parse(params.url)
  if (! data) return

  return {
    html: template(data.id),
    provider_url: providerUrl,
    type: 'document'
  }
}

/**
 * Exports
 */

export default gdocs
