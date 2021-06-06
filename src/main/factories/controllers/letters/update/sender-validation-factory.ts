import { ValidationComposite } from '../../../../../presentation/helpers/validators'
import { Validation } from '../../../../../presentation/protocols/validation'
import { exists } from '../../../../../utils/object-exists'
import { CpfValidatorAdapter } from '../../../../adapters/cpf-validator-adapter/cpf-validator-adapter'
import { CpfValidation } from '../../../../../presentation/helpers/validators/cpf/cpf-validation'
import { createAddressValidation } from './address-validation-factory'
import { OptionalFieldsValidation } from '../../../../../presentation/helpers/validators/optional-fields-validation'

class SenderCompositeValidation extends ValidationComposite {
  validate (input: any): Error {
    const { sender } = input
    if (exists(sender)) {
      return super.validate(sender)
    }

    return null
  }
}

export const createSenderValidation = function (): ValidationComposite {
  const validations: Validation[] = []

  for (const field of ['name', 'surname', 'birthday', 'contact', 'cpf']) {
    validations.push(new OptionalFieldsValidation(field))
  }

  validations.push(new CpfValidation('cpf', new CpfValidatorAdapter()))
  validations.push(createAddressValidation())
  return new SenderCompositeValidation(validations)
}
