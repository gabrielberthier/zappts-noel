import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

describe('Login routes', () => {
  let collection: Collection = null

  beforeAll(async function () {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await MongoHelper.disconnect()
  })

  beforeEach(async function () {
    collection = await MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })

  it('Should return 200 on login', async () => {
    const password = await hash('123456', 12)
    await collection.insertOne({
      name: 'El Gabus',
      email: 'gabsthier@gmail.com',
      password
    })
    await request(app).post('/api/login').send({
      email: 'gabsthier@gmail.com',
      password: '123456'
    }).expect(200)
  })
})
