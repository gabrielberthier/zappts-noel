import { LoginController } from './login'
import { HttpResponse, HttpRequest } from '../../protocols'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

const makeSut = function (): LoginController {
  const sut = new LoginController()
  return sut
}

describe('Login Controller test', () => {
  it('Should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'passworderson'
      }
    }
    const httpresponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpresponse.statusCode).toBe(400)
    expect(httpresponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
