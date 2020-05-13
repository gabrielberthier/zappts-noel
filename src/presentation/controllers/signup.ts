import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols'
import empty from '../../utils/stringchecker'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      let er: Error
      const requiredFields: string[] = ['name', 'email', 'password', 'passwordConfirm']

      for (const field of requiredFields) {
        if (empty(httpRequest.body[field])) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return badRequest(er)
    } catch (error) {
      return serverError()
    }
  }
}
