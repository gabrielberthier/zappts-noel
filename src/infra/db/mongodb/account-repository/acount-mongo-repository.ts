import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { AddAccountModel } from '../../../../domain/models/add-account-model'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { exists } from '../../../../utils/object-exists'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository {
  async addUserAccount (_account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(_account)

    return MongoHelper.mapCollection<AccountModel>(result.ops[0])
  }

  async loadAccountUsingEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountModel: AccountModel = await accountCollection.findOne({ email })
    if (exists(accountModel)) {
      return MongoHelper.mapCollection<AccountModel>(accountModel)
    }
    return null
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken: token
      }
    })
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const account = await (await MongoHelper.getCollection('accounts')).findOne({
      accessToken: token,
      role
    })
    if (exists(account)) {
      return MongoHelper.mapCollection<AccountModel>(account)
    }
    return null
  }
}
