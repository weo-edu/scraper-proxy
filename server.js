/**
 * Modules
 */
import koa from 'koa'
import koaLogger from 'koa-logger'
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

/**
 * Exports
 */
export default app


/*
  Logging
 */
weoLogger('scraper')
app.use(koaLogger())

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
