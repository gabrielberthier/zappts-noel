import { AddAccountModel } from '../../../../domain/models/add-account-model'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { exists } from '../../../../utils/object-exists'
import { AddLetterRepository } from '@/data/protocols/db/letter/add-letter-repository'
import { LetterModelDto } from '@/domain/models/add-letter-dto'
import { LetterModel } from '@/domain/models/letter'

export class MongoLetterRepository implements AddLetterRepository {
  async addLetter (letterModelDto: LetterModelDto): Promise<LetterModel> {
    const collection = await MongoHelper.getCollection('letters')
    const letterModel: LetterModel = await collection.findOne({ 'sender.cpf': letterModelDto.sender.cpf })

    if (exists(letterModel)) {
      return null
    }

    const result = await collection.insertOne({ ...letterModelDto, createdAt: new Date() })

    return MongoHelper.mapCollection<LetterModel>(result.ops[0])
  }

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
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    if (exists(account)) {
      return MongoHelper.mapCollection<AccountModel>(account)
    }
    return null
  }
}
