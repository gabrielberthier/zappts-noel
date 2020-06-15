import { LogControllerDecorator } from '../../../../presentation/decorators/log-controller-decorator'
import { Controller } from '../../../../presentation/protocols'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log-repository/log-repository'
import { makeLoginValidation } from './login-validation-factory'
import { LoginController } from '../../../../presentation/controllers/auth/login/login'
import { makeDBAuthenticationFactory } from '../../usecases/authentication/db-authentication-factory'

export const makeLoginController = function (): Controller {
  const authentication = makeDBAuthenticationFactory()
  const validationComposite = makeLoginValidation()
  const loginController = new LoginController(authentication, validationComposite)
  const logger = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logger)
}
