import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../presentation/utils/email-validator-adapter'
import { DBAddAccount } from '../../data/use-cases/add-account/add-account-db'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogControllerDecorator } from '../../presentation/decorators/log-controller-decorator'
import { Controller } from '../../presentation/protocols'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log-repository'

export const makeSignUpController = function (): Controller {
  const emailValidator = new EmailValidatorAdapter()
  const addAccount = new DBAddAccount(new BCryptAdapter(), new AccountMongoRepository())
  const signUpController = new SignUpController(emailValidator, addAccount)
  const logger = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logger)
}
