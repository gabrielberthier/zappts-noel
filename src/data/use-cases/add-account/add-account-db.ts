import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './add-account-db-protocols'

export class DBAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly addAccountRepository: AddAccountRepository

  constructor (hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async addUserAccount (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)
    const accountModel = await this.addAccountRepository.addUserAccount(Object.assign({ }, account, { password: hashedPassword }))
    return accountModel
  }
}
