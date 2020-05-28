import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import emptyString from '../../../utils/empty-string'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

export class LoginController implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = {
      body: {

      },
      statusCode: 400
    }
    if (emptyString(request.body.email)) {
      return badRequest(new MissingParamError('email'))
    }
    return httpResponse
  }
}
