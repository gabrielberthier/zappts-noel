import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/use-cases/add-survey'

let surveyCollection: Collection = null

describe('Survey - Mongo Repository', () => {
  beforeAll(async function () {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await MongoHelper.disconnect()
  })

  beforeEach(async function () {
    surveyCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
  })

  const makeSut = (): SurveyMongoRepository => {
    const sut = new SurveyMongoRepository()
    return sut
  }

  it('Should ', async () => {
    const sut = makeSut()
    const addSurveyModel: AddSurveyModel = {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
    await sut.addSurvey(addSurveyModel)
    const survey = surveyCollection.findOne({
      question: 'any_question'
    })
    expect(survey).toBeTruthy()
  })
})
