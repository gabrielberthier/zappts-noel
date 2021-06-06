import { LogControllerDecorator } from '../../../../../presentation/decorators/log-controller-decorator'
import { Controller, Validation } from '../../../../../presentation/protocols'
import { AddLetterController } from '../../../../../presentation/controllers/letter/add-letter-controller'
import { createSenderValidation } from './sender-validation-factory'
import { RequiredFieldValidation, ValidationComposite } from '../../../../../presentation/helpers/validators'
import { AddLetterDb } from '../../../../../data/use-cases/letter-crud/add-letter/add-letter-db'
import { MongoLetterRepository } from '../../../../../infra/db/mongodb/letter-repository/letter-repository'
import { LogMongoRepository } from '../../../../../infra/db/mongodb/log-repository/log-repository'

export const addLettersControllerFactory = function (): Controller {
  const validations: Validation[] = []
  validations.push(new RequiredFieldValidation('text'))
  validations.push(createSenderValidation())
  const composite = new ValidationComposite(validations)
  const service = new AddLetterDb(new MongoLetterRepository())
  const lettersController = new AddLetterController(composite, service)
  const logger = new LogMongoRepository()
  return new LogControllerDecorator(lettersController, logger)
}
