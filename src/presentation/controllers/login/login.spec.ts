import { LoginController } from './login'
import { Validation, HttpResponse, HttpRequest, Authentication } from './login-protocols'
import { badRequest, serverError, unauthorized, responseOK } from '../../helpers/http/http-helper'
import { MissingParamError } from '../../errors'
import { AuthenticationModel } from '../../../domain/use-cases/authentication'

interface SutTypes {
  sut: LoginController
  auth: Authentication
  validation: Validation
}

const makeSut = function (): SutTypes {
  const auth = makeAuthentication()
  const validation = makeValidation()
  const sut = new LoginController(auth, validation)
  return {
    sut,
    auth,
    validation
  }
}

// const makeEmailValidator = function (): EmailValidator {
//   class EmailValidatorStub implements EmailValidator {
//     isValid (email: string): boolean {
//       return true
//     }
//   }

//   return new EmailValidatorStub()
// }

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuthentication = function (): Authentication {
  class AuthenticationStub implements Authentication {
    async auth (auth: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

describe('Login Controller test', () => {
  it('Should call Authentication with correct values', async () => {
    const { sut, auth } = makeSut()
    const authSpy = jest.spyOn(auth, 'auth')
    const httpRequest: HttpRequest = {
      body: {
        email: 'kyle@gmail.com',
        password: 'passworderson'
      }
    }
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({ email: 'kyle@gmail.com', password: 'passworderson' })
  })

  it('Should return 401 if an invalid credential is provided', async () => {
    const { sut, auth } = makeSut()
    const spyAuth = jest.spyOn(auth, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest: HttpRequest = {
      body: {
        email: 'kyle@gmail.com',
        password: 'passworderson'
      }
    }
    const httpresponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpresponse).toEqual(unauthorized())
    expect(spyAuth).toHaveBeenCalledWith({ email: 'kyle@gmail.com', password: 'passworderson' })
  })

  it('Should receive 500 if Authentication throws error', async () => {
    const { sut, auth } = makeSut()
    jest.spyOn(auth, 'auth').mockImplementationOnce(async function () {
      return await new Promise((resolve, reject) => reject(new Error('damnn')))
    })
    const httpRequest: HttpRequest = {
      body: {
        email: 'kyle@gmail',
        password: 'passworderson'
      }
    }
    const httpresponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpresponse).toEqual(serverError(new Error('damnn')))
  })

  it('Should return 200 on valid credentials', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'kyle@gmail.com',
        password: 'passworderson'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(responseOK({
      access_token: 'any_token'
    }))
  })

  test('Should call Validation with correct value', async function () {
    const { sut, validation } = makeSut()
    const validationSpy = jest.spyOn(validation, 'validate')
    const httpRequest = {
      body: {
        name: 'John T Dee',
        email: 'johndee@email',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async function () {
    const { sut, validation } = makeSut()
    const validationSpy = jest.spyOn(validation, 'validate')
    validationSpy.mockReturnValueOnce(new MissingParamError('any'))
    const httpRequest = {
      body: {
        name: 'John T Dee',
        email: 'johndee@email',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any')))
  })
})
