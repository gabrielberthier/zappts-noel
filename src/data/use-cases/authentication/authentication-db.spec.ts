import { AuthenticationModel } from '../../../domain/use-cases/authentication/authentication'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DBAuthentication } from './authentication-db'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'

interface SutTypes {
  loadAccountByEmailRepository: LoadAccountByEmailRepository
  hashComparer: HashComparer
  tokenGenerator: TokenGenerator
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

const makeTokenGenerator = function (): TokenGenerator {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return 'mockedreturntoken'
    }
  }
  return new TokenGeneratorStub()
}

const makeSut = function (): SutTypes {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepositoryStub()
  const hashComparer = makeHashComparer()
  const tokenGenerator = makeTokenGenerator()
  const sut = new DBAuthentication(loadAccountByEmailRepository, hashComparer, tokenGenerator)
  return {
    sut, loadAccountByEmailRepository, hashComparer, tokenGenerator
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

  it('Should throw error if Comparer throws', async () => {
    const { sut, hashComparer } = makeSut()
    jest.spyOn(hashComparer, 'compare')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const auth = makeFakeAuthenticationModel()
    const returnValue = sut.auth(auth)
    await expect(returnValue).rejects.toThrow()
  })

  it('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparer } = makeSut()
    jest.spyOn(hashComparer, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => resolve(false)))
    const auth = makeFakeAuthenticationModel()
    const token: string = await sut.auth(auth)
    expect(token).toBeNull()
  })

  it('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGenerator } = makeSut()
    const generateTokenSpy = jest.spyOn(tokenGenerator, 'generate')
    const auth = makeFakeAuthenticationModel()
    await sut.auth(auth)
    expect(generateTokenSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw error if TokenGenerator throws', async () => {
    const { sut, tokenGenerator } = makeSut()
    jest.spyOn(tokenGenerator, 'generate')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const auth = makeFakeAuthenticationModel()
    const returnValue = sut.auth(auth)
    await expect(returnValue).rejects.toThrow()
  })

  it('Should receive a valid token', async () => {
    const { sut } = makeSut()
    const auth = makeFakeAuthenticationModel()
    const accessToken = await sut.auth(auth)
    expect(accessToken).toBe('mockedreturntoken')
  })
})
