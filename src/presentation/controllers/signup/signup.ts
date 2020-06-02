import { HttpRequest, HttpResponse, Controller } from '../../protocols'
import empty from '../../../utils/empty-string'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, responseOK } from '../../helpers/http-helper'
import { AddAccount } from '../../../domain/use-cases/add-account'
import { EmailValidator } from '../../../data/protocols/email-validator'
import { Validation } from '../../helpers/validators/validation'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error: Error = this.validation.validate(httpRequest.body)
      if (!(error === null || error === undefined)) {
        return badRequest(error)
      }
      const requiredFields: string[] = ['name', 'email', 'password', 'passwordConfirm']

      for (const field of requiredFields) {
        if (empty(httpRequest.body[field])) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, password, passwordConfirm, email } = httpRequest.body
      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.addUserAccount({
        name, password, email
      })

      return responseOK(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
