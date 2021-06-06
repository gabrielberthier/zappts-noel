import { Router } from 'express'
import { adaptRoute } from '../../adapters/express/express-route-adapter'
import { addLettersControllerFactory } from '../../factories/controllers/letters/create/add-letters-controller-factory'

function routefy (router: Router): void {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/letter', adaptRoute(addLettersControllerFactory()))
}

export default routefy
