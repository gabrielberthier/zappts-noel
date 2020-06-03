import { AuthenticationModel } from '../../../domain/use-cases/authentication/authentication'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DBAuthentication } from './authentication-db'

interface SutTypes {
  loadAccountByEmailRepository: LoadAccountByEmailRepository
  sut: DBAuthentication
}

const makeFakeAccount = function (): AccountModel {
  const account: AccountModel = {
    email: 'any_email',
    id: 'any_id',
    name: 'any_name',
    password: 'any_pass'
  }

  return account
}

const makeLoadAccountByEmailRepositoryStub = function (): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
  return loadAccountByEmailRepository
}

const makeFakeAuthenticationModel = function (): AuthenticationModel {
  const auth: AuthenticationModel = {
    email: 'john@mail.com',
    password: 'any_pass'
  }
  return auth
}

const makeSut = function (): SutTypes {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepositoryStub()
  const sut = new DBAuthentication(loadAccountByEmailRepository)
  return {
    sut, loadAccountByEmailRepository
  }
}

describe('DB Authentication use case', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    const auth = makeFakeAuthenticationModel()
    await sut.auth(auth)
    expect(loadSpy).toHaveBeenCalledWith(auth.email)
  })

  it('Should throw error if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const auth = makeFakeAuthenticationModel()
    const returnValue = sut.auth(auth)
    await expect(returnValue).rejects.toThrow()
  })
})
