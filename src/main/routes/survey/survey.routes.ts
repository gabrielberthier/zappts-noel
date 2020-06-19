import { Router } from 'express'
import { adaptRoute } from '../../adapters/express/express-route-adapter'
import { makeSurveyController } from '../../factories/controllers/survey/survey-controller-factory'
import { adaptMiddleware } from '../../adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '../../factories/middlewares/auth-middleware-factory'

function routefy (router: Router): void {
  router.post('/surveys', adaptMiddleware(makeAuthMiddleware('admin')), adaptRoute(makeSurveyController()))
}

export default routefy
