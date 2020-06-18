import { TokenReader } from '../../protocols/cryptography/token-reader'
import { DBLoadAccountByToken } from './db-load-account-by-token'

describe('DBLoadAccountByToken set', () => {
  it('Should call decrypter with correct values', async () => {
    class DecrypterStub implements TokenReader {
      async decrypt (token: string): Promise<string> {
        return 'any_value'
      }
    }
    const decrypterStub = new DecrypterStub()
    const sut = new DBLoadAccountByToken(decrypterStub)
    const spyDecrypter = jest.spyOn(decrypterStub, 'decrypt')
    await sut.loadAccount('any_token')
    expect(spyDecrypter).toHaveBeenCalledWith('any_token')
  })
})
