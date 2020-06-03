import { Validation } from '../../protocols/validation'
import { MissingParamError } from '../../errors'
import emptyString from '../../../utils/empty-string'

export class RequiredFieldValidation implements Validation {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: any): Error {
    if (emptyString(input[this.fieldName])) {
      return new MissingParamError(this.fieldName)
    }
  }
}
