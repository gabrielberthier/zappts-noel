import { LogControllerDecorator } from './log-controller-decorator'
import { HttpRequest, Controller, HttpResponse } from '../protocols'

class ControllerStub implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: {
        name: 'Rony'
      }
    }
    return await new Promise(resolve => resolve(httpResponse))
  }
}

describe('Log Controller Testing', () => {
  it('Assure controller handler is called within decorator', async () => {
    const controllerStub = new ControllerStub()
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest: HttpRequest = {
      body: {
        name: 'any name',
        email: 'anymail@gmail.com',
        password: 'any pass',
        passwordConfirm: 'any pass'
      }
    }
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
