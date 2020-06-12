import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/acount-mongo-repository'
import { BCryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AddAccount } from '../../../../domain/use-cases/add-account'
import { DBAddAccount } from '../../../../data/use-cases/add-account/add-account-db'

export const makeDBAddAccountFactory = function (): AddAccount {
  const addAccount = new DBAddAccount(new BCryptAdapter(), new AccountMongoRepository(), new AccountMongoRepository())
  return addAccount
}
