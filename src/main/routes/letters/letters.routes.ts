/* eslint-disable @typescript-eslint/no-misused-promises */
import { selectLettersControllerFactory } from '../../factories/controllers/letters/selection/select-letters-controller-factory'
import { Router } from 'express'
import { adaptRoute } from '../../adapters/express/express-route-adapter'
import { addLettersControllerFactory } from '../../factories/controllers/letters/create/add-letters-controller-factory'
import { deleteLettersControllerFactory } from '../../factories/controllers/letters/delete/delete-letter-controller-factory'
import { updateLettersControllerFactory } from '../../factories/controllers/letters/update/update-letters-controller-factory'

function routefy (router: Router): void {
  router.post('/letter', adaptRoute(addLettersControllerFactory()))
  router.get('/letter', adaptRoute(selectLettersControllerFactory()))
  router.delete('/letter/:id', adaptRoute(deleteLettersControllerFactory()))
  router.put('/letter/:id', adaptRoute(updateLettersControllerFactory()))
}

export default routefy
