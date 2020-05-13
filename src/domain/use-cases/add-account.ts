import { AccountModel } from '../models/account'
import { AddAccountModel } from '../models/add-account-model'

export interface AddAccount{
  addUserAccount (account: AddAccountModel): AccountModel
}
