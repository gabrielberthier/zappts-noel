import { DBAddAccount } from './add-account-db'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes{
  sut: DBAddAccount
  encrypterStub: Encrypter
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
  const sut = new DBAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
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
})
