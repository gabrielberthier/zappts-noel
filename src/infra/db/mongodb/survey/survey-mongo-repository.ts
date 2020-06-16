import { AddSurveyRepository, AddSurveyModel } from '../../../../data/use-cases/add-survey/add-survey-db-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async addSurvey (addSurveyModel: AddSurveyModel): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.insertOne(addSurveyModel)
  }
}
