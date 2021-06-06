import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { LetterRepository } from '@/data/protocols/db/letter/letter-repository'
import { MongoLetterRepository } from './letter-repository'

let lettersCollection: Collection

describe('Letters - Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    lettersCollection = await MongoHelper.getCollection('letters')
    await lettersCollection.deleteMany({})
  })

  const makeSut = (): LetterRepository => {
    const sut = new MongoLetterRepository()
    return sut
  }

  it('Should return an account on success', async () => {
    const sut = makeSut()
    const sender = {
      name: 'Maria Julia',
      surname: 'Nogueira Berthier',
      birthday: new Date(),
      contact: '98 99999-0000',
      cpf: '946546546',
      address: {
        uf: 'MA',
        city: 'Sao Luis',
        cep: '65066-330',
        number: '145',
        complement: '',
        place: 'Rua dos Bobos'
      }
    }
    const text = 'Dear, Santa...'
    const letter = await sut.addLetter({
      sender, text
    })
    expect(letter).toBeTruthy()
    expect(letter.id).toBeTruthy()
    expect(letter.sender).toBe(sender)
    expect(letter.text).toBe(text)
  })
})
