import { ValidationComposite, EmailValidation, RequiredFieldValidation } from '../../../../presentation/helpers/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../adapters/email-adapter/email-validator-adapter'

export const makeLoginValidation = function (): ValidationComposite {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  // console.log(validations)
  return new ValidationComposite(validations)
}
