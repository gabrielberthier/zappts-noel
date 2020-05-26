import empty from '../../../utils/empty-string'

function mongodbURLDecider (): string {
  return (!empty(process.env.MONGO_URL)) ? process.env.MONGO_URL : 'mongodb://localhost:27017/clean-node-api'
}

function portUsed (): any {
  return (!empty(process.env.PORT)) ? process.env.PORT : 5050
}

export const environment = {
  mongoURL: mongodbURLDecider(),
  port: portUsed()
}
