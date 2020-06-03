import { Validation } from './validation'
import { exists } from '../../../utils/object-exists'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor (validations: Validation[]) {
    this.validations = validations
  }

  validate (input: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if (exists(error)) {
        return error
      }
    }
    return null
  }
}
