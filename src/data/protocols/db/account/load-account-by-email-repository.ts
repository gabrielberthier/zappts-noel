import { AccountModel } from '../../../../domain/models/account'

export interface LoadAccountByEmailRepository{
  loadAccountUsingEmail (email: string): Promise<AccountModel>
}
