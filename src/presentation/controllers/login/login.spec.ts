import { LoginController } from './login'
import { EmailValidator, HttpResponse, HttpRequest, Authentication } from './login-protocols'
import { badRequest, serverError, unauthorized, responseOK } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'

interface SutTypes {
  sut: LoginController
  emailValidator: EmailValidator
  auth: Authentication
}

const makeSut = function (): SutTypes {
  const emailValidator = makeEmailValidator()
  const auth = makeAuthentication()
  const sut = new LoginController(emailValidator, auth)
  return {
    sut,
    emailValidator,
    auth
  }
}

const makeEmailValidator = function (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAuthentication = function (): Authentication {
  class EmailValidatorStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }

  return new EmailValidatorStub()
}

describe('Login Controller test', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'passworderson'
      }
    }
    const httpresponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpresponse.statusCode).toBe(400)
    expect(httpresponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'kyle@gmail.com'
      }
    }
    const httpresponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpresponse.statusCode).toBe(400)
    expect(httpresponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should email validator with correct email', async () => {
    const { sut, emailValidator } = makeSut()
    const spyEmail = jest.spyOn(emailValidator, 'isValid')
    const httpRequest: HttpRequest = {
      body: {
        email: 'kyle@gmail.com',
        password: 'passworderson'
      }
    }
    await sut.handle(httpRequest)
    expect(spyEmail).toHaveBeenCalledWith('kyle@gmail.com')
  })

  it('Should 400 if invalid email is provided', async () => {
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const httpRequest: HttpRequest = {
      body: {
        email: 'kyle@gmail',
        password: 'passworderson'
      }
    }
    const httpresponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpresponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should receive 500 if emailValidator throws an error', async () => {
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(function () {
      throw new Error('damnn')
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
    expect(authSpy).toHaveBeenCalledWith('kyle@gmail.com', 'passworderson')
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
    expect(spyAuth).toHaveBeenCalledWith('kyle@gmail.com', 'passworderson')
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
})
