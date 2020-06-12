import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './add-account-db-protocols'
import { LoadAccountByEmailRepository } from '../authentication/authentication-db-protocols'
import { exists } from '../../../utils/object-exists'

export class DBAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly addAccountRepository: AddAccountRepository
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (hasher: Hasher, addAccountRepository: AddAccountRepository, loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async addUserAccount (account: AddAccountModel): Promise<AccountModel> {
    const accountExistence = await this.loadAccountByEmailRepository.loadAccountUsingEmail(account.email)
    if (!exists(accountExistence)) {
      const hashedPassword = await this.hasher.hash(account.password)
      const accountModel = await this.addAccountRepository.addUserAccount(Object.assign({ }, account, { password: hashedPassword }))
      return accountModel
    }
    return null
  }
}
