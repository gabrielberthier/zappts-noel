import { Express } from 'express'
import { bodyParser, cors, contentType } from '../middlewares'
import { serve, setup } from 'swagger-ui-express'
import { readFileSync } from 'fs'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(contentType)
  app.use(cors)
  const swaggerFile = (process.cwd() + '/swagger/swagger.json')
  const swaggerData = readFileSync(swaggerFile, 'utf8')

  const swaggerDocument = JSON.parse(swaggerData)
  app.use('/api/docs', serve, setup(swaggerDocument))
}
