/**
 * Imports
 */

import koa from 'koa'
import cors from 'kcors'
import mount from 'koa-mount'
import weoLogger from 'weo-logger'
import {port} from './lib/config'
import main from './lib/main'
import handleError from './lib/handleError'

/**
 * Vars
 */

const app = koa()

/*
  Logging
 */

weoLogger('scraper')

/**
 * CORS
 */

app.use(cors())

/*
  Main app
 */

app.use(mount(main))

/*
  Listen
 */

app.listen(port, () => {
  console.log('listening', port)
})

/**
 * Exports
 */

export default app
