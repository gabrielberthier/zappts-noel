import { Controller, HttpRequest, HttpResponse } from './letter-protocols'
import { serverError, responseOK, badRequest } from '../../helpers/http/http-helper'
import { UpdateLetter } from '../../../domain/use-cases/letters/update-letter'
import { Validation } from '../../../presentation/protocols'
import { exists } from '../../../utils/object-exists'
import { WrongIdFormat } from '../../../presentation/errors/wrong-id-format'

export class UpdateLetterController implements Controller {
  constructor (
    private readonly updateLetter: UpdateLetter,
    private readonly validation: Validation
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const error: Error = this.validation.validate(request.body)

      if (exists(error)) {
        return badRequest(error)
      }

      const { id } = request.params

      const { sender, text } = request.body
      const letterSaved = await this.updateLetter.update(id, { sender, text })

      return responseOK({ message: 'Cartinha atualizada com sucesso!', letterSaved })
    } catch (error) {
      if (error instanceof WrongIdFormat) {
        return badRequest(error)
      }
      return serverError(error)
    }
  }
}
