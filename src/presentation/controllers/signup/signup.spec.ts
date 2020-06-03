import { SignUpController } from './signup'
import { MissingParamError } from '../../errors/index'
import { AddAccount } from '../../../domain/use-cases/add-account'
import { AddAccountModel } from '../../../domain/models/add-account-model'
import { AccountModel } from '../../../domain/models/account'
import { Validation } from '../../helpers/validators/validation'
import { badRequest } from '../../helpers/http/http-helper'

interface SutFactoryResolved {
  sut: SignUpController
  addAccount: AddAccount
  validation: Validation
}

const sutFactory = (): SutFactoryResolved => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut, addAccount: addAccountStub, validation: validationStub
  }
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
