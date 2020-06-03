import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import emptyString from '../../../utils/empty-string'
import { badRequest, serverError, unauthorized, responseOK } from '../../helpers/http/http-helper'
import { Authentication } from '../../../domain/use-cases/authentication'
import { Validation } from '../../helpers/validators/validation'
import { exists } from '../../../utils/object-exists'

export class LoginController implements Controller {
  constructor (private readonly authentication: Authentication, private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (exists(error)) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
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
