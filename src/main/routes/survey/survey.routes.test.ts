import request from 'supertest'
import app from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { environment } from '../../config/environment/env'

describe('Survey routes', () => {
  let surveyCollection: Collection = null
  let accountCollection: Collection = null

  beforeAll(async function () {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await MongoHelper.disconnect()
  })

  beforeEach(async function () {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  it('Should return 403 on post to /surveys wothout access token', async () => {
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
    await surveyCollection.insertOne(addSurveyModel)
    await request(app).post('/api/surveys').send(addSurveyModel).expect(403)
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
    const res = await accountCollection.insertOne({
      name: 'El Gabus',
      email: 'gabsthier@gmail.com',
      password,
      role: 'admin'
    })
    const id = res.ops[0]._id
    const accessToken = sign({ id }, environment.jwt_secret)
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken
      }
    })
    await request(app).post('/api/surveys').set('x-access-token', accessToken).send(addSurveyModel).expect(204)
  })
})
