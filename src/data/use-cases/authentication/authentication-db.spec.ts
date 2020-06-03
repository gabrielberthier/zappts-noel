import { AuthenticationModel } from '../../../domain/use-cases/authentication/authentication'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DBAuthentication } from './authentication-db'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'

interface SutTypes {
  loadAccountByEmailRepository: LoadAccountByEmailRepository
  hashComparer: HashComparer
  sut: DBAuthentication
}

const makeFakeAccount = function (): AccountModel {
  const account: AccountModel = {
    email: 'any_email',
    id: 'any_id',
    name: 'any_name',
    password: 'hashed_password'
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

const makeHashComparer = function (): HashComparer {
  class HashComparerStub implements HashComparer {
    async compare (password: string, hash: string): Promise<boolean> {
      // return password === hashed
      return true
    }
  }

  const hashComparer = new HashComparerStub()
  return hashComparer
}

const makeSut = function (): SutTypes {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepositoryStub()
  const hashComparer = makeHashComparer()
  const sut = new DBAuthentication(loadAccountByEmailRepository, hashComparer)
  return {
    sut, loadAccountByEmailRepository, hashComparer
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

  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(null)
    const auth = makeFakeAuthenticationModel()
    const token: string = await sut.auth(auth)
    expect(token).toBeNull()
  })

  it('Should HashCompare with correct password', async () => {
    const { sut, hashComparer } = makeSut()
    const spyCompare = jest.spyOn(hashComparer, 'compare').mockReturnValueOnce(null)
    const auth = makeFakeAuthenticationModel()
    await sut.auth(auth)
    expect(spyCompare).toHaveBeenCalledWith('any_pass', 'hashed_password')
  })

  it('Should throw error if LoadAccountByEmailRepository throws', async () => {
    const { sut, hashComparer } = makeSut()
    jest.spyOn(hashComparer, 'compare')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const auth = makeFakeAuthenticationModel()
    const returnValue = sut.auth(auth)
    await expect(returnValue).rejects.toThrow()
  })
})
