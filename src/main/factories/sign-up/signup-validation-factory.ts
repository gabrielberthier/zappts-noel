import { ValidationComposite, EmailValidation, RequiredFieldValidation, CompareFieldsValidation } from '../../../presentation/helpers/validators'
import { EmailValidatorAdapter } from '../../../presentation/utils/email-validator-adapter'
import { Validation } from '../../../presentation/protocols/validation'

export const makeSignUpValidation = function (): ValidationComposite {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  // console.log(validations)
  return new ValidationComposite(validations)
}
