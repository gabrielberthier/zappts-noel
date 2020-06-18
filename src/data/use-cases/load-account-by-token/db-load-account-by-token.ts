import { LoadAccountByAccessToken } from '../../../domain/use-cases/load-account-by-access-token'
import { AccountModel } from '../../../domain/models/account'
import { TokenReader } from '../../protocols/cryptography/token-reader'

export class DBLoadAccountByToken implements LoadAccountByAccessToken {
  constructor (private readonly tokenDecrypter: TokenReader) {

  }

  async loadAccount (accessToken: string, role?: string): Promise<AccountModel> {
    await this.tokenDecrypter.decrypt(accessToken)
    return null
  }
}
