import express from 'express'
import setupMiddleware from './middlewares'
import routes from './routes'

const app = express()

setupMiddleware(app)
routes(app)

export default app
