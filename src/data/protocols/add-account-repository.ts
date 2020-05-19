import { AddAccountModel, AccountModel } from '../use-cases/add-account/add-account-db-protocols'

export interface AddAccountRepository{
  addUserAccount (account: AddAccountModel): Promise<AccountModel>
}
