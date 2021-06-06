import { ValidationComposite, RequiredFieldValidation } from '../../../../../presentation/helpers/validators'
import { Validation } from '../../../../../presentation/protocols/validation'
import { exists } from '../../../../../utils/object-exists'

class AddressValidationComposite extends ValidationComposite {
  validate (input: any): Error {
    const { address } = input
    if (exists(address)) {
      return super.validate(address)
    }

    return null
  }
}

export const createAddressValidation = function (): ValidationComposite {
  const validations: Validation[] = []

  for (const field of ['uf', 'city', 'cep', 'number', 'place']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new AddressValidationComposite(validations)
}
