import { SignUpController } from '../../../../presentation/controllers/signup/signup'
import { LogControllerDecorator } from '../../../../presentation/decorators/log-controller-decorator'
import { Controller } from '../../../../presentation/protocols'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log-repository/log-repository'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDBAuthenticationFactory } from '../../usecases/authentication/db-authentication-factory'
import { makeDBAddAccountFactory } from '../../usecases/db-add-account/db-add-account-factory'

export const makeSignUpController = function (): Controller {
  const addAccount = makeDBAddAccountFactory()
  const validationComposite = makeSignUpValidation()
  const authentication = makeDBAuthenticationFactory()
  const signUpController = new SignUpController(addAccount, validationComposite, authentication)
  const logger = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logger)
}
