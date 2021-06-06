import { LogControllerDecorator } from '../../../../../presentation/decorators/log-controller-decorator'
import { Controller } from '../../../../../presentation/protocols'
import { MongoLetterRepository } from '../../../../../infra/db/mongodb/letter-repository/letter-repository'
import { LogMongoRepository } from '../../../../../infra/db/mongodb/log-repository/log-repository'
import { DeleteLetterDB } from '../../../../../data/use-cases/letter-crud/delete-letter/delete-letter-db'
import { DeleteLetterController } from '../../../../../presentation/controllers/letter/delete-letter-controller'

export const deleteLettersControllerFactory = function (): Controller {
  const service = new DeleteLetterDB(new MongoLetterRepository())
  const lettersController = new DeleteLetterController(service)
  const logger = new LogMongoRepository()
  return new LogControllerDecorator(lettersController, logger)
}
