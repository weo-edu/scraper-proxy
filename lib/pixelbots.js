/**
 * Imports
 */

import request from './request'

/**
 * URL Pattern
 */

const re = /^(?:https?\:\/\/)?(?:www\.)?pixelbots.io\/playlist\/[a-zA-Z0-9\-\_]+(?:\/view\/?)?$/
const devRe = /^(?:https?\:\/\/)?(?:artbot-dev\.)?firebaseapp.com\/playlist\/[a-zA-Z0-9\-\_]+(?:\/view\/?)?$/

/**
 * Pixelbots integration
 */

function * pixelbots (data) {
  if (!re.test(data.url) && !devRe.test(data.url)) {
    return
  }

  const res = yield request
    .get(data.url)
    .set('Accept', 'application/json')

  const activity = res.body

  activity.providerName = 'pixelbots'
  activity.url = data.url

  return activity
}

/**
 * Exports
 */

export default pixelbots
