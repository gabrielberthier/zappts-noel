import { DBAddAccount } from './add-account-db'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes{
  sut: DBAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  class EncrypterStub implements Encrypter {
    async encrypt (): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  const encrypterStub = new EncrypterStub()
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
})
