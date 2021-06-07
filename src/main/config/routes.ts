import { Express, Router } from 'express'
import { readdirSync, statSync } from 'fs'
import emptyString from '../../utils/empty-string'
// import fg from 'fast-glob'

function getAllFiles (pathDir: string, filesArray: string[] = [], append: string = ''): string[] {
  const files = readdirSync(pathDir)
  files.forEach(function (file) {
    if (statSync(pathDir + '/' + file).isDirectory()) {
      filesArray = getAllFiles(pathDir + '/' + file, filesArray, file)
    } else {
      if (!emptyString(append)) {
        file = append + '/' + file
      }
      filesArray.push(file)
    }
  })

  return filesArray
}

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  // fg.sync('**/src/main/routes/**.routes.ts').map(async (file) => {
  //   const callback = (await import(`../../../${file}`)).default
  //   callback(router)
  // })
  getAllFiles(`${__dirname}/../routes`).map(async function (file) {
    if (!file.includes('.test') && !file.endsWith('.map')) {
      const callback = (await import(`../routes/${file}`)).default
      callback(router)
    }
  })
}
