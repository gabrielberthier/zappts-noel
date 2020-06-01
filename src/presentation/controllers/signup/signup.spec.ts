import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors/index'
import { EmailValidator } from '../../../data/protocols/email-validator'
import { AddAccount } from '../../../domain/use-cases/add-account'
import { AddAccountModel } from '../../../domain/models/add-account-model'
import { AccountModel } from '../../../domain/models/account'
import { Validation } from '../../helpers/validators/validation'
import { badRequest } from '../../helpers/http-helper'

interface SutFactoryResolved {
  sut: SignUpController
  email: EmailValidator
  addAccount: AddAccount
  validation: Validation
}

const sutFactory = (): SutFactoryResolved => {
  const emailValidator = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidator, addAccountStub, validationStub)
  return {
    sut, email: emailValidator, addAccount: addAccountStub, validation: validationStub
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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async addUserAccount (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      return await Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountStub()
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async function () {
    const { sut } = sutFactory()
    const httpRequest = {
      body: {
        email: 'johndee@email.com',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', async function () {
    const { sut } = sutFactory()
    const httpRequest = {
      body: {
        name: 'johndee@email.com',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if an invalid email is provided', async function () {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 500 if EmailValidator throws errror', async function () {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(new Error()))
  })

  test('Should call emailValidator with correct email', async function () {
    const { sut, email } = await sutFactory()
    const isValidSpy = jest.spyOn(email, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'John T Dee',
        email: 'johndee@email',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('johndee@email')
  })

  test('Should call addAccount with values', async function () {
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
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'John T Dee',
      email: 'johndee@email',
      password: 'testablepassword'
    })
  })

  test('Should return 400 if password confirmation fails', async function () {
    const { sut } = sutFactory()
    const httpRequest = {
      body: {
        name: 'John T Dee',
        email: 'johndee@email',
        password: 'testablepassword',
        passwordConfirm: 'otherpassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return 200 if valid data is provided', async function () {
    const { sut } = sutFactory()

    const httpRequest = {
      body: {
        name: 'John T Dee',
        email: 'johndee@email',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })

  test('Should call Validation with correct value', async function () {
    const { sut, validation } = sutFactory()
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
    const { sut, validation } = sutFactory()
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
