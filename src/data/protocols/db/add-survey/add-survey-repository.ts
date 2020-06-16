import { AddSurveyModel } from '../../../../domain/use-cases/add-survey'

export interface AddSurveyRepository{
  addSurvey (addSurveyModel: AddSurveyModel): Promise<void>
}
