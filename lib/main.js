/**
 * Imports
 */
import koa from 'koa'
import route from 'koa-route'
import cache from './cache'
import setup from './setup'
import handleError from './handleError'
import health from './health'
import scrape from './scrape'

/**
 * Vars
 */
const app = koa()

/**
 * Error Handling
 */
app.use(handleError)

/**
 * Response Caching
 */
app.use(cache())

/**
 * Setup
 */
app.use(setup)

/**
 * Routes
 */
app.use(route.get('/', health))
app.use(route.get('/1/oembed', scrape))

/**
 * Exports
 */
export default app