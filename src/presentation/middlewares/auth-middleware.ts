import { Middleware } from '../protocols/middleware'
import { HttpRequest, HttpResponse } from '../protocols'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const { headers } = request
    return forbidden(new AccessDeniedError())
  }
}
