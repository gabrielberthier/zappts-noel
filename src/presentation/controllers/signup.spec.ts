import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'

interface SutFactoryResolved {
  sut: SignUpController
  email: EmailValidator
}

const sutFactory = (): SutFactoryResolved => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidator = new EmailValidatorStub()
  const sut = new SignUpController(emailValidator)
  return {
    sut,
    email: emailValidator
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', function () {
    const { sut } = sutFactory()
    const httpRequest = {
      body: {
        email: 'johndee@email.com',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', function () {
    const { sut } = sutFactory()
    const httpRequest = {
      body: {
        name: 'johndee@email.com',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if an invalid email is provided', function () {
    const { sut, email } = sutFactory()
    jest.spyOn(email, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'John T Dee',
        email: 'johndee@email',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})
