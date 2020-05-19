import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AddAccountModel } from '../../../../domain/models/add-account-model'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async addUserAccount (_account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(_account)
    const account = result.ops[0]

    const { _id, ...accountLessUnderscoreID } = account

    return Object.assign({}, accountLessUnderscoreID, { id: _id })
  }
}
