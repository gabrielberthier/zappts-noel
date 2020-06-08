import empty from '../../../utils/empty-string'

// function mongodbURLDecider (): string {
//   return (!empty(process.env.MONGO_URL)) ? process.env.MONGO_URL : 'mongodb://localhost:27017/clean-node-api'
// }

// function portUsed (): any {
//   return (!empty(process.env.PORT)) ? process.env.PORT : 5050
// }

// function jwtSecret (): string {
//   return (!empty(process.env.PORT)) ? process.env.JWT_SECRET : '@22mithrandir1946=='
// }

function eDefault (defaultParam: string, provided: any): any {
  return (!empty(process.env[defaultParam])) ? process.env[defaultParam] : provided
}

export const environment = {
  mongoURL: eDefault('MONGO_URL', 'mongodb://mongo:27017/clean-node-api'),
  port: eDefault('PORT', 5050),
  jwt_secret: eDefault('JWT_SECRET', '@22mithrandir1946==')
}
