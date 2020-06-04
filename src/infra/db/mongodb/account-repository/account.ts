import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AddAccountModel } from '../../../../domain/models/add-account-model'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { exists } from '../../../../utils/object-exists'

export class AccountMongoRepository implements AddAccountRepository {
  async addUserAccount (_account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(_account)

    return MongoHelper.mapCollection<AccountModel>(result.ops[0])
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountModel: AccountModel = await accountCollection.findOne({ email })
    if (exists(accountModel)) { return MongoHelper.mapCollection<AccountModel>(accountModel) }
    return null
  }
}
