import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Sign-up routes', () => {
  beforeAll(async function () {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await MongoHelper.disconnect()
  })

  beforeEach(async function () {
    await MongoHelper.getCollection('accounts').deleteMany({})
  })

  it('Should return an account on success', async () => {
    await request(app).post('/api/sign-up').send({
      name: 'El Gabus',
      email: 'gabsthier@gmail.com',
      password: '123456',
      passwordConfirm: '123456'
    }).expect({
      ok: 'ok?'
    })
  })
})
