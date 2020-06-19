import { Middleware } from '../protocols/middleware'
import { HttpRequest, HttpResponse } from '../protocols'
import { AccessDeniedError } from '../errors'
import { forbidden, responseOK, serverError } from '../helpers/http/http-helper'
import { LoadAccountByAccessToken } from '../../domain/use-cases/load-account-by-access-token'
import emptyString from '../../utils/empty-string'
import { exists } from '../../utils/object-exists'
import { AccountModel } from '../../domain/models/account'

export class AuthMiddleware implements Middleware {
  private readonly loadAccountByAccessToken: LoadAccountByAccessToken
  private readonly role?: string
  constructor (loadAccountByAccessToken: LoadAccountByAccessToken, role?: string) {
    this.loadAccountByAccessToken = loadAccountByAccessToken
    this.role = role
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = request.headers?.['x-access-token']
      console.log(accessToken)
      if (emptyString(accessToken)) {
        return forbidden(new AccessDeniedError())
      }
      const accountModel: AccountModel = await this.loadAccountByAccessToken.loadAccount(accessToken, this.role)
      console.log(accountModel)
      if (!exists(accountModel)) {
        return forbidden(new AccessDeniedError())
      }
      const { id, name } = accountModel

      return responseOK({
        id, name
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
