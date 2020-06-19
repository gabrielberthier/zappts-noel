import request from 'supertest'
import app from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

describe('Survey routes', () => {
  let surveyCollection: Collection = null

  beforeAll(async function () {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await MongoHelper.disconnect()
  })

  beforeEach(async function () {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  it('Should return 204 on post to /surveys', async () => {
    const password = await hash('123456', 12)
    const addSurveyModel = {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          image: 'any_image2',
          answer: 'any_answer2'
        }
      ]
    }
    await surveyCollection.insertOne({
      name: 'El Gabus',
      email: 'gabsthier@gmail.com',
      password
    })
    await request(app).post('/api/surveys').send(addSurveyModel).expect(403)
  })
})
