import { Validation } from '../../protocols/validation'
import { OptionalParamError } from '../../../presentation/errors/optional-param-error'

export class OptionalFieldsValidation implements Validation {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: any): Error {
    const str: string = input[this.fieldName]
    const isSet = !(str === undefined || str === null)
    if (isSet && (str.length === 0 || str === '')) {
      return new OptionalParamError(this.fieldName)
    }
  }
}
