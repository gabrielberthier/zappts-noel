import { Validation } from '../../../protocols/validation'
import { InvalidParamError } from '../../../errors'
import { CpfValidator } from '@/data/protocols/validators/cpf-validator'

export class CpfValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly validator: CpfValidator) {

  }

  validate (input: any): Error {
    const isValid = this.validator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
