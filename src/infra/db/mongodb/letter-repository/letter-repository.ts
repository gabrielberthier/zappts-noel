import { AddAccountModel } from '../../../../domain/models/add-account-model'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { exists } from '../../../../utils/object-exists'
import { AddLetterRepository } from '@/data/protocols/db/letter/add-letter-repository'
import { LetterModelDto } from '../../../../domain/models/add-letter-dto'
import { LetterModel } from '../../../../domain/models/letter'
import { SelectLettersRepository } from '../../../../data/protocols/db/letter/select-letter-repository'
import { DeleteLetterRepository } from '@/data/protocols/db/letter/delete-letter-repository'
import { ObjectID } from 'bson'

export class MongoLetterRepository implements AddLetterRepository, SelectLettersRepository, DeleteLetterRepository {
  async deleteLetter (id: string): Promise<LetterModel> {
    const collection = await MongoHelper.getCollection('letters')
    const objectId = new ObjectID(id)
    const letter = await collection.find({ _id: objectId }).toArray()

    const model: LetterModel = MongoHelper.mapCollection<LetterModel>(letter.pop())

    await collection.deleteOne({ _id: objectId })

    return model
  }

  async getAll (): Promise<LetterModel[]> {
    const collection = await MongoHelper.getCollection('letters')
    const lettersRaw = (await collection.find().toArray())

    const letters: LetterModel[] = lettersRaw.map((el) => MongoHelper.mapCollection<LetterModel>(el))

    return letters
  }

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
