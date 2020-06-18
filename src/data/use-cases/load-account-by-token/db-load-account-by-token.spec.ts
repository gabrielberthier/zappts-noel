import { TokenReader } from '../../protocols/cryptography/token-reader'
import { DBLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

interface SutTypes{
  sut: DBLoadAccountByToken
  decrypter: TokenReader
  loadAccountByTokenRepository: LoadAccountByTokenRepository
}

function makeDecrypter (): TokenReader {
  class DecrypterStub implements TokenReader {
    async decrypt (token: string): Promise<string> {
      return 'any_value'
    }
  }
  const decrypterStub = new DecrypterStub()
  return decrypterStub
}

function makeFakeAccountModel (): AccountModel {
  const fakeAccount = {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
  }
  return fakeAccount
}

function makeSut (): SutTypes {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepository: LoadAccountByTokenRepository = makeLoadAccountByToken()
  const sut = new DBLoadAccountByToken(decrypterStub, loadAccountByTokenRepository)
  return {
    sut,
    decrypter: decrypterStub,
    loadAccountByTokenRepository
  }
}

function makeLoadAccountByToken (): LoadAccountByTokenRepository {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return makeFakeAccountModel()
    }
  }
  const loadAccountByTokenStub = new LoadAccountByTokenRepositoryStub()
  return loadAccountByTokenStub
}

describe('DBLoadAccountByToken set', () => {
  it('Should call decrypter with correct values', async () => {
    const { sut, decrypter } = makeSut()
    const spyDecrypter = jest.spyOn(decrypter, 'decrypt')
    await sut.loadAccount('any_token', 'any_role')
    expect(spyDecrypter).toHaveBeenCalledWith('any_token')
  })

  it('Should return null if TokenReader decrypting returns null', async () => {
    const { sut, decrypter } = makeSut()
    jest.spyOn(decrypter, 'decrypt').mockReturnValueOnce(null)
    const account = await sut.loadAccount('any_token', 'any_role')
    expect(account).toBeNull()
  })

  it('Should call LoadAccountByToken with correct values', async () => {
    const { sut, loadAccountByTokenRepository } = makeSut()
    const loadDecrypter = jest.spyOn(loadAccountByTokenRepository, 'loadByToken')
    await sut.loadAccount('any_token', 'any_role')
    expect(loadDecrypter).toHaveBeenCalledWith('any_token', 'any_role')
  })
})
