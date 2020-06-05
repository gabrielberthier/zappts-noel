import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/acount-mongo-repository'
import { LogControllerDecorator } from '../../../presentation/decorators/log-controller-decorator'
import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-repository'
import { makeLoginValidation } from './login-validation-factory'
import { LoginController } from '../../../presentation/controllers/login/login'
import { DBAuthentication } from '../../../data/use-cases/authentication/authentication-db'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JWTAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { environment } from '../../config/environment/env'

export const makeLoginController = function (): Controller {
  const accountMongoRepository = new AccountMongoRepository()
  const bCryptAdapter = new BCryptAdapter()
  const jwtAdapter = new JWTAdapter(environment.jwt_secret)
  const accountMongoRepositor = new AccountMongoRepository()
  const authentication = new DBAuthentication(
    accountMongoRepository,
    bCryptAdapter,
    jwtAdapter,
    accountMongoRepositor
  )
  const validationComposite = makeLoginValidation()
  const loginController = new LoginController(authentication, validationComposite)
  const logger = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logger)
}
