import { Router } from 'express'
import { makeSignUpController } from '../../factories/controllers/sign-up/signup-factory'
import { adaptRoute } from '../../adapters/express/express-route-adapter'
import { makeLoginController } from '../../factories/controllers/login/login-factory'

function routefy (router: Router): void {
  router.post('/sign-up', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}

export default routefy
