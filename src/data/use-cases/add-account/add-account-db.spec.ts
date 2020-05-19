import { DBAddAccount } from './add-account-db'
import { Encrypter, AddAccount, AddAccountRepository } from './add-account-db-protocols'
import { AddAccountModel } from '../../../domain/models/add-account-model'
import { AccountModel } from '../../../domain/models/account'

interface SutTypes{
  sut: DBAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
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

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DBAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DBAddAccount Use Case', () => {
  it('Should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
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
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
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
})
