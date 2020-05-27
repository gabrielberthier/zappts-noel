import { LogControllerDecorator } from './log-controller-decorator'
import { HttpRequest, Controller, HttpResponse } from '../protocols'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeController = (): Controller => {
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

  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut, controllerStub
  }
}

describe('Log Controller Testing', () => {
  const { controllerStub, sut } = makeSut()
  it('Assure controller handler is called within decorator', async () => {
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
