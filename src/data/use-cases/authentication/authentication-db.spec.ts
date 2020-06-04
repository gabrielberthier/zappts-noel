import {
  AuthenticationModel,
  AccountModel,
  LoadAccountByEmailRepository,
  HashComparer,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './authentication-db-protocols'
import { DBAuthentication } from './authentication-db'

interface SutTypes {
  loadAccountByEmailRepository: LoadAccountByEmailRepository
  hashComparer: HashComparer
  tokenGenerator: TokenGenerator
  updateAccessTokenRepository: UpdateAccessTokenRepository
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

const makeUpdateAccessTokenRepository = function (): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  const updateAccessTokenRepository = new UpdateAccessTokenRepositoryStub()
  return updateAccessTokenRepository
}

const makeLoadAccountByEmailRepositoryStub = function (): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadAccountUsingEmail (email: string): Promise<AccountModel> {
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
  const updateAccessTokenRepository = makeUpdateAccessTokenRepository()
  const sut = new DBAuthentication(loadAccountByEmailRepository, hashComparer, tokenGenerator, updateAccessTokenRepository)
  return {
    sut, loadAccountByEmailRepository, hashComparer, tokenGenerator, updateAccessTokenRepository
  }
}

describe('DB Authentication use case', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'loadAccountUsingEmail')
    const auth = makeFakeAuthenticationModel()
    await sut.auth(auth)
    expect(loadSpy).toHaveBeenCalledWith(auth.email)
  })

  it('Should throw error if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'loadAccountUsingEmail')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const auth = makeFakeAuthenticationModel()
    const returnValue = sut.auth(auth)
    await expect(returnValue).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'loadAccountUsingEmail').mockReturnValueOnce(null)
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

  it('Should call UpdateAccessTokenRepository with correct token', async () => {
    const { sut, updateAccessTokenRepository } = makeSut()
    const updateTokenSpy = jest.spyOn(updateAccessTokenRepository, 'updateAccessToken')
    const auth = makeFakeAuthenticationModel()
    await sut.auth(auth)
    expect(updateTokenSpy).toHaveBeenCalledWith('any_id', 'mockedreturntoken')
  })
})
