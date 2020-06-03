import { Router } from 'express'
import { makeSignUpController } from '../factories/sign-up/signup-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

function routefy (router: Router): void {
  router.post('/sign-up', adaptRoute(makeSignUpController()))
}

export default routefy
