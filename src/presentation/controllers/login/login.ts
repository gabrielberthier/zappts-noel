import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import emptyString from '../../../utils/empty-string'
import { badRequest, serverError } from '../../helpers/http-helper'
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
      await this.authentication.auth(email, password)
      return httpResponse
    } catch (error) {
      return serverError(error)
    }
  }
}
