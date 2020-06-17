import { AccountModel } from '../models/account'

export interface LoadAccountByAccessToken{
  loadAccount (accessToken: string, role?: string): Promise<AccountModel>
}
