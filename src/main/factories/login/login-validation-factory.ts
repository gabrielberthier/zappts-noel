import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { EmailValidatorAdapter } from '../../../presentation/utils/email-validator-adapter'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../presentation/protocols/validation'

export const makeLoginValidation = function (): ValidationComposite {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  // console.log(validations)
  return new ValidationComposite(validations)
}
