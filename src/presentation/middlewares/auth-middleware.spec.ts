import { HttpRequest, HttpResponse } from '../protocols/index'
import { forbidden, responseOK, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import { AuthMiddleware } from './auth-middleware'
import { AccountModel } from '../../domain/models/account'
import { LoadAccountByAccessToken } from '../../domain/use-cases/load-account-by-access-token'

interface SutTypes{
  sut: AuthMiddleware
  loadAccountByAccessToken: LoadAccountByAccessToken
}

function makeSut (): SutTypes {
  const loadAccountByAccessToken = makeLoadAccountByAccessToken()
  const authMiddleware = new AuthMiddleware(loadAccountByAccessToken)
  return {
    sut: authMiddleware,
    loadAccountByAccessToken
  }
}

function makeFakeAccountModel (): AccountModel {
  const accountModel: AccountModel = {
    id: 'any_id',
    email: 'any_email',
    name: 'any_name',
    password: 'any_password'
  }
  return accountModel
}

function makeLoadAccountByAccessToken (): LoadAccountByAccessToken {
  class LoadAccountByAccessTokenStub implements LoadAccountByAccessToken {
    async loadAccount (): Promise<AccountModel> {
      return makeFakeAccountModel()
    }
  }

  const loadAccountByAccessTokenStub = new LoadAccountByAccessTokenStub()
  return loadAccountByAccessTokenStub
}

describe('AuthMiddleware', () => {
  it('Should return 403 if no x-access-token is found in headers', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      headers: {

      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should call LoadAccountByAccessToken with correct values', async () => {
    const { sut, loadAccountByAccessToken } = makeSut()
    const httpRequest: HttpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }
    const loadAccountSpy = jest.spyOn(loadAccountByAccessToken, 'loadAccount')
    await sut.handle(httpRequest)
    expect(loadAccountSpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return 403 if no account is found by LoadAccountByAccessToken', async () => {
    const { sut, loadAccountByAccessToken } = makeSut()
    const httpRequest: HttpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }
    jest.spyOn(loadAccountByAccessToken, 'loadAccount').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 200 if an account is returned by LoadAccountByAccessToken', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(responseOK({
      id: 'any_id',
      name: 'any_name'
    }))
  })
  it('Should return 500 LoadAccountByAccessToken throws', async () => {
    const { sut, loadAccountByAccessToken } = makeSut()
    const httpRequest: HttpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }
    jest.spyOn(loadAccountByAccessToken, 'loadAccount').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
