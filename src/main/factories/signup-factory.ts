import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../presentation/utils/email-validator-adapter'
import { DBAddAccount } from '../../data/use-cases/add-account/add-account-db'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'

export const makeSignUpController = function (): SignUpController {
  const emailValidator = new EmailValidatorAdapter()
  const addAccount = new DBAddAccount(new BCryptAdapter(), new AccountMongoRepository())
  const signUpController = new SignUpController(emailValidator, addAccount)
  return signUpController
}
