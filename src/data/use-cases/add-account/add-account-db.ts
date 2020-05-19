import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository } from './add-account-db-protocols'

export class DBAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async addUserAccount (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    await this.addAccountRepository.addUserAccount(Object.assign({ }, account, { password: hashedPassword }))
    return await new Promise(resolve => resolve(null))
  }
}
