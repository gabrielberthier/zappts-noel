import { Middleware } from '../protocols/middleware'
import { HttpRequest, HttpResponse } from '../protocols'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { LoadAccountByAccessToken } from '../../domain/use-cases/load-account-by-access-token'
import emptyString from '../../utils/empty-string'

export class AuthMiddleware implements Middleware {
  private readonly loadAccountByAccessToken: LoadAccountByAccessToken

  constructor (loadAccountByAccessToken: LoadAccountByAccessToken) {
    this.loadAccountByAccessToken = loadAccountByAccessToken
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const accessToken = request.headers?.['x-access-token']
    if (emptyString(accessToken)) {
      return forbidden(new AccessDeniedError())
    }
    await this.loadAccountByAccessToken.loadAccount(accessToken)
    return null
  }
}
