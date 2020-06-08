import { Express, Router } from 'express'
import { readdirSync } from 'fs'
// import fg from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  // fg.sync('**/src/main/routes/**.routes.ts').map(async (file) => {
  //   const callback = (await import(`../../../${file}`)).default
  //   callback(router)
  // })
  readdirSync(`${__dirname}/../routes`).map(async function (file) {
    if (!file.includes('.test')) {
      const callback = (await import(`../routes/${file}`)).default
      callback(router)
    }
  })
}
