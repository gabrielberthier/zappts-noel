import { HttpRequest, HttpResponse } from '../protocols/index'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import { AuthMiddleware } from './auth-middleware'

describe('AuthMiddleware', () => {
  it('Should return 403 if no x-access-token is found in headers', async () => {
    const sut = new AuthMiddleware()
    const httpRequest: HttpRequest = {
      headers: {

      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
