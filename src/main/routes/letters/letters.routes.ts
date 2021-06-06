/* eslint-disable @typescript-eslint/no-misused-promises */
import { selectLettersControllerFactory } from '../../factories/controllers/letters/selection/select-letters-controller-factory'
import { Router } from 'express'
import { adaptRoute } from '../../adapters/express/express-route-adapter'
import { addLettersControllerFactory } from '../../factories/controllers/letters/create/add-letters-controller-factory'

function routefy (router: Router): void {
  router.post('/letter', adaptRoute(addLettersControllerFactory()))
  router.get('/letter', adaptRoute(selectLettersControllerFactory()))
  router.delete('/delete')
}

export default routefy
