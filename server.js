/**
 * Modules
 */
import express from 'express'
import weoLogger from 'weo-logger'
import morgan from 'morgan'
import cors from 'cors'
import config from './lib/config'
import main from './lib/main'
import handleError from './lib/handleError'

/**
 * Vars
 */
const app = express()

/**
 * Exports
 */
export default app

/*
  Logging
 */
weoLogger('scraper')
app.use(morgan('tiny'))

/*
  Config
 */
app.configure('development', () => {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }))
})

app.configure('production', () => {
  app.use(express.errorHandler())
})

app.use(cors())

/*
  Listen
 */
app.listen(config.port, () => {
  console.log('listening', config.port)
})

/*
  Boot
 */
app.use(main)

/**
 * Global error handler
 */
app.use(handleError)
