import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { LogMongoRepository } from './log-repository'

describe('Log Mongo repository', () => {
  let errorsCollection: Collection

  beforeAll(async function () {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await MongoHelper.disconnect()
  })

  beforeEach(async function () {
    errorsCollection = await MongoHelper.getCollection('errors')
    await errorsCollection.deleteMany({})
  })

  it('Should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('error')
    const count = await errorsCollection.countDocuments()
    expect(count).toBe(1)
  })
})
