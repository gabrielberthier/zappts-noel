import { LogControllerDecorator } from '../../../../../presentation/decorators/log-controller-decorator'
import { Controller, Validation } from '../../../../../presentation/protocols'
import { MongoLetterRepository } from '../../../../../infra/db/mongodb/letter-repository/letter-repository'
import { LogMongoRepository } from '../../../../../infra/db/mongodb/log-repository/log-repository'
import { UpdateLetterDB } from '../../../../../data/use-cases/letter-crud/update-letter/delete-letter-db'
import { UpdateLetterController } from '../../../../../presentation/controllers/letter/update-letter-controller'
import { OptionalFieldsValidation } from '../../../../../presentation/helpers/validators/optional-fields-validation'
import { createSenderValidation } from './sender-validation-factory'
import { ValidationComposite } from '../../../../../presentation/helpers/validators'

export const updateLettersControllerFactory = function (): Controller {
  const validations: Validation[] = []
  validations.push(new OptionalFieldsValidation('text'))
  validations.push(createSenderValidation())
  const composite = new ValidationComposite(validations)
  const service = new UpdateLetterDB(new MongoLetterRepository())
  const lettersController = new UpdateLetterController(service, composite)
  const logger = new LogMongoRepository()
  return new LogControllerDecorator(lettersController, logger)
}
