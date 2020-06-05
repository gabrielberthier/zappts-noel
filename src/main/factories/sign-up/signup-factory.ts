import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { DBAddAccount } from '../../../data/use-cases/add-account/add-account-db'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/aacount-mongo-repository'
import { LogControllerDecorator } from '../../../presentation/decorators/log-controller-decorator'
import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-repository'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = function (): Controller {
  const addAccount = new DBAddAccount(new BCryptAdapter(), new AccountMongoRepository())
  const validationComposite = makeSignUpValidation()
  const signUpController = new SignUpController(addAccount, validationComposite)
  const logger = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logger)
}
