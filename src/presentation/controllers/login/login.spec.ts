import { LoginController } from './login'
import { HttpResponse, HttpRequest } from '../../protocols'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { EmailValidator } from '../../../data/protocols/email-validator'

interface SutTypes {
  sut: LoginController
  emailValidator: EmailValidator
}

const makeSut = function (): SutTypes {
  const emailValidator = makeEmailValidator()
  const sut = new LoginController(emailValidator)
  return {
    sut,
    emailValidator
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
})
