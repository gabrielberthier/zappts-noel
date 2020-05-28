import { LogControllerDecorator } from './log-controller-decorator'
import { HttpRequest, Controller, HttpResponse } from '../protocols'
import { serverError } from '../helpers/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logger: LogErrorRepository
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
  const logger = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logger)
  return {
    sut, controllerStub, logger
  }
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (errorTrack: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new LogErrorRepositoryStub()
}

describe('Log Controller Testing', () => {
  it('Assure controller handler is called within decorator', async () => {
    const { controllerStub, sut } = makeSut()
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

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    // definitions
    const { controllerStub, sut, logger } = makeSut()
    const error = new Error()
    error.stack = 'Ski-Ba-Bop-Ba-Dop-Bop'
    const httpRequest: HttpRequest = {
      body: {
        name: 'any name',
        email: 'anymail@gmail.com',
        password: 'any pass',
        passwordConfirm: 'any pass'
      }
    }

    // spies
    const handleSpy = jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(serverError(error))))
    const logSpy = jest.spyOn(logger, 'logError')

    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    expect(logSpy).toHaveBeenCalledWith(error.stack)
  })
})
