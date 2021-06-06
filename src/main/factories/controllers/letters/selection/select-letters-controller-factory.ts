import { LogControllerDecorator } from '../../../../../presentation/decorators/log-controller-decorator'
import { Controller } from '../../../../../presentation/protocols'
import { SelectLettersController } from '../../../../../presentation/controllers/letter/select-letters-controller'
import { MongoLetterRepository } from '../../../../../infra/db/mongodb/letter-repository/letter-repository'
import { LogMongoRepository } from '../../../../../infra/db/mongodb/log-repository/log-repository'
import { SelectLettersDB } from '../../../../../data/use-cases/letter-crud/select-letters/select-letters-db'

export const selectLettersControllerFactory = function (): Controller {
  const service = new SelectLettersDB(new MongoLetterRepository())
  const lettersController = new SelectLettersController(service)
  const logger = new LogMongoRepository()
  return new LogControllerDecorator(lettersController, logger)
}
