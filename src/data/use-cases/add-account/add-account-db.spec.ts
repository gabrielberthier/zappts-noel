import { DBAddAccount } from './add-account-db'
import { Hasher, AddAccount, AddAccountRepository } from './add-account-db-protocols'
import { AddAccountModel } from '../../../domain/models/add-account-model'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../authentication/authentication-db-protocols'

interface SutTypes{
  sut: DBAddAccount
  encrypterStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepository: LoadAccountByEmailRepository
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadAccountUsingEmail (email: string): Promise<AccountModel> {
      return await Promise.resolve(null)
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository, AddAccount {
    async addUserAccount (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeEncrypter = (): Hasher => {
  class EncrypterStub implements Hasher {
    async hash (): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DBAddAccount(encrypterStub, addAccountRepositoryStub, loadAccountByEmailRepository)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepository
  }
}

describe('DBAddAccount Use Case', () => {
  it('Should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'hash')
    const accountData = {
      name: 'John Doe',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.addUserAccount(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw error if encrypter library throws errors', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'John Doe',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const promise = sut.addUserAccount(accountData)
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'addUserAccount')
    const accountData = {
      name: 'John Doe',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.addUserAccount(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  it('Should throw error if repository is unable to save data and throws errors', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'addUserAccount').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'John Doe',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const promise = sut.addUserAccount(accountData)
    await expect(promise).rejects.toThrow()
  })

  it('Should return an account if correct data is provided and operation is successful', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'John Doe',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const account = await sut.addUserAccount(accountData)
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const spy = jest.spyOn(loadAccountByEmailRepository, 'loadAccountUsingEmail')
    const addAccountParams = {
      email: 'any_mail@gmail.com',
      name: 'name',
      password: '123456'
    }
    await sut.addUserAccount(addAccountParams)
    expect(spy).toHaveBeenCalledWith(addAccountParams.email)
  })
})
