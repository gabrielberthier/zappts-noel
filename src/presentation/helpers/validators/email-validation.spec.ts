import { EmailValidator } from '../../../data/protocols/email-validator'
import { EmailValidation } from './email-validation'
import { InvalidParamError } from '../../errors'

interface SutFactoryResolved {
  sut: EmailValidation
  email: EmailValidator
}

const sutFactory = (): SutFactoryResolved => {
  const emailValidator = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidator)
  return {
    sut, email: emailValidator
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUp Controller', () => {
  test('Should throw if EmailValidator throws errror', function () {
    const { sut, email } = sutFactory()
    jest.spyOn(email, 'isValid').mockImplementationOnce(function () {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })

  test('Should return an error if EmailValidator returns false', function () {
    const { sut, email } = sutFactory()
    jest.spyOn(email, 'isValid').mockReturnValueOnce(false)
    const response = sut.validate({ email: 'johndee@email.com' })
    expect(response).toEqual(new InvalidParamError('email'))
  })

  test('Should call emailValidator with correct email', function () {
    const { sut, email } = sutFactory()
    const isValidSpy = jest.spyOn(email, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'John T Dee',
        email: 'johndee@email.com',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    sut.validate({ email: httpRequest.body.email })
    expect(isValidSpy).toHaveBeenCalledWith('johndee@email.com')
  })
})
