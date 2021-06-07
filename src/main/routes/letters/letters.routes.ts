/* eslint-disable @typescript-eslint/no-misused-promises */
import { selectLettersControllerFactory } from '../../factories/controllers/letters/selection/select-letters-controller-factory'
import { Router } from 'express'
import { adaptRoute } from '../../adapters/express/express-route-adapter'
import { addLettersControllerFactory } from '../../factories/controllers/letters/create/add-letters-controller-factory'
import { deleteLettersControllerFactory } from '../../factories/controllers/letters/delete/delete-letter-controller-factory'
import { updateLettersControllerFactory } from '../../factories/controllers/letters/update/update-letters-controller-factory'
import { makeAuthMiddleware } from '../../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../../adapters/express/express-middleware-adapter'

function routefy (router: Router): void {
  const auth = makeAuthMiddleware()
  const authFlag = adaptMiddleware(auth)
  router.post('/letter', authFlag, adaptRoute(addLettersControllerFactory()))
  router.get('/letter', authFlag, adaptRoute(selectLettersControllerFactory()))
  router.delete('/letter/:id', authFlag, adaptRoute(deleteLettersControllerFactory()))
  router.put('/letter/:id', authFlag, adaptRoute(updateLettersControllerFactory()))
}

export default routefy
