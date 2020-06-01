import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import emptyString from '../../../utils/empty-string'
import { badRequest, serverError, unauthorized, responseOK } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { EmailValidator } from '../../../data/protocols/email-validator'
import { Authentication } from '../../../domain/use-cases/authentication'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields: string[] = ['email', 'password']
      for (const field of requiredFields) {
        if (emptyString(httpRequest.body[field])) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }
      const accessToken = await this.authentication.auth(email, password)
      if (emptyString(accessToken)) {
        return unauthorized()
      }
      return responseOK({
        access_token: accessToken
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
