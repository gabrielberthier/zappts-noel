import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors/index'
import { EmailValidator } from './email-validator'
import { AddAccount } from '../../../domain/use-cases/add-account'
import { AddAccountModel } from '../../../domain/models/add-account-model'
import { AccountModel } from '../../../domain/models/account'

interface SutFactoryResolved {
  sut: SignUpController
  email: EmailValidator
  addAccount: AddAccount
}

const sutFactory = (): SutFactoryResolved => {
  const emailValidator = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidator, addAccountStub)
  return {
    sut, email: emailValidator, addAccount: addAccountStub
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

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    addUserAccount (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
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

  test('Should return 500 if EmailValidator throws errror', function () {
    const { sut, email } = sutFactory()
    jest.spyOn(email, 'isValid').mockImplementationOnce(function () {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'John T Dee',
        email: 'johndee@email',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call emailValidator with correct email', function () {
    const { sut, email } = sutFactory()
    const isValidSpy = jest.spyOn(email, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'John T Dee',
        email: 'johndee@email',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('johndee@email')
  })

  test('Should call addAccount with values', function () {
    const { sut, addAccount } = sutFactory()
    const addSpy = jest.spyOn(addAccount, 'addUserAccount')
    const httpRequest = {
      body: {
        name: 'John T Dee',
        email: 'johndee@email',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'John T Dee',
      email: 'johndee@email',
      password: 'testablepassword'
    })
  })

  test('Should return 400 if password confirmation fails', function () {
    const { sut } = sutFactory()
    const httpRequest = {
      body: {
        name: 'John T Dee',
        email: 'johndee@email',
        password: 'testablepassword',
        passwordConfirm: 'otherpassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return 200 if valid data is provided', function () {
    const { sut } = sutFactory()

    const httpRequest = {
      body: {
        name: 'John T Dee',
        email: 'johndee@email',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })
})
