import { MongoHelper } from '../helpers/mongo-helper'
import { exists } from '../../../../utils/object-exists'
import { AddLetterRepository } from '@/data/protocols/db/letter/add-letter-repository'
import { LetterModelDto } from '../../../../domain/models/add-letter-dto'
import { LetterModel } from '../../../../domain/models/letter'
import { SelectLettersRepository } from '../../../../data/protocols/db/letter/select-letter-repository'
import { DeleteLetterRepository } from '@/data/protocols/db/letter/delete-letter-repository'
import { ObjectID } from 'bson'
import { UpdateLetterRepository } from '@/data/protocols/db/letter/update-letter-repository'

export class MongoLetterRepository implements AddLetterRepository, SelectLettersRepository, DeleteLetterRepository, UpdateLetterRepository {
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

  async updateLetter (id: string, letterDto: LetterModelDto): Promise<LetterModel> {
    const collection = await MongoHelper.getCollection('letters')
    const objectId = new ObjectID(id)
    const letter = await collection.find({ _id: objectId }).toArray()

    const subject: LetterModel = MongoHelper.mapCollection<LetterModel>(letter.pop())

    if (exists(subject)) {
      const model = Object.assign({}, subject, letterDto)

      await collection.updateOne({ _id: objectId }, {
        $set: {
          ...letterDto
        }
      })

      return model
    }

    return null
  }

  async deleteLetter (id: string): Promise<LetterModel> {
    const collection = await MongoHelper.getCollection('letters')
    const objectId = new ObjectID(id)
    const letter = await collection.find({ _id: objectId }).toArray()

    const model: LetterModel = MongoHelper.mapCollection<LetterModel>(letter.pop())

    await collection.deleteOne({ _id: objectId })

    return model
  }
}
