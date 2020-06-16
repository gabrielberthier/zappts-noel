import { AddSurvey, AddSurveyModel } from '../../../domain/use-cases/add-survey'
import { AddSurveyRepository } from '../../protocols/db/add-survey/add-survey-repository'

export class DBAddSurvey implements AddSurvey {
  private readonly addSurveyRepository: AddSurveyRepository
  constructor (addSurveyRepository: AddSurveyRepository) {
    this.addSurveyRepository = addSurveyRepository
  }

  async add (addSurveyModel: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.addSurvey(addSurveyModel)
    return null
  }
}
