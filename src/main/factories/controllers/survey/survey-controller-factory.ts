import { LogControllerDecorator } from '../../../../presentation/decorators/log-controller-decorator'
import { Controller } from '../../../../presentation/protocols'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log-repository/log-repository'
import { makeAddSurveyValidationFactory } from './add-survey-validation-factory'
import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { DBAddSurvey } from '../../../../data/use-cases/add-survey/add-survey-db'

export const makeSurveyController = function (): Controller {
  const addSurveyRepository = new SurveyMongoRepository()
  const dbAddSurvey = new DBAddSurvey(addSurveyRepository)
  const addSurveyController = new AddSurveyController(makeAddSurveyValidationFactory(), dbAddSurvey)
  const logger = new LogMongoRepository()
  return new LogControllerDecorator(addSurveyController, logger)
}
