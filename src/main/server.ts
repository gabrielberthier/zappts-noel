/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import { environment } from './config/environment/env'

MongoHelper.connect(environment.mongoURL).then(async () => {
  const app = (await import('./config/app')).default
  const port = environment.port
  app.listen(environment.port, () => console.log(`'Listening server running at http://localhost:${port} ok'`))
}).catch(console.error)
