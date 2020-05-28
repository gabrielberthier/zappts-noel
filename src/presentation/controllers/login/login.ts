import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import emptyString from '../../../utils/empty-string'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { EmailValidator } from '../../../data/protocols/email-validator'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields: string[] = ['email', 'password']
    const httpResponse: HttpResponse = {
      body: {

      },
      statusCode: 400
    }
    for (const field of requiredFields) {
      if (emptyString(httpRequest.body[field])) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { email, password } = httpRequest.body
    if (!this.emailValidator.isValid(email)) {
      return badRequest(new InvalidParamError('email'))
    }
    return httpResponse
  }
}
