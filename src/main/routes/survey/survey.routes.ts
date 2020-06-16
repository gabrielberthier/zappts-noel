import { Router } from 'express'
import { adaptRoute } from '../../adapters/express/express-route-adapter'
import { makeSurveyController } from '../../factories/controllers/survey/survey-controller-factory'

function routefy (router: Router): void {
  router.post('/surveys', adaptRoute(makeSurveyController()))
}

export default routefy
