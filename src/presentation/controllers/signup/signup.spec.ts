import { SignUpController } from './signup'
import { MissingParamError } from '../../errors/index'
import { Validation } from '../../protocols/validation'
import { badRequest, serverError, responseOK } from '../../helpers/http/http-helper'
import { AccountModel, Authentication, HttpRequest, AuthenticationModel, AddAccount, AddAccountModel } from './signup-protocols'
import { HttpResponse } from '../../protocols'

interface SutFactoryResolved {
  sut: SignUpController
  addAccount: AddAccount
  validation: Validation
  auth: Authentication
}

const sutFactory = (): SutFactoryResolved => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const auth = makeAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, auth)
  return {
    sut, addAccount: addAccountStub, validation: validationStub, auth
  }
}

const makeAuthentication = function (): Authentication {
  class AuthenticationStub implements Authentication {
    async auth (auth: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
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
    expect(httpResponse).toEqual(responseOK({ accessToken: 'any_token' }))
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

  it('Should call Authentication with correct values', async () => {
    const { sut, auth } = sutFactory()
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

  it('Should receive 500 if Authentication throws error', async () => {
    const { sut, auth } = sutFactory()
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
})
