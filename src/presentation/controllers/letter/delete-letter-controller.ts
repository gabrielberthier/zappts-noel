import { Controller, HttpRequest, HttpResponse } from './letter-protocols'
import { serverError, responseOK, badRequest } from '../../helpers/http/http-helper'
import { DeleteLetter } from '@/domain/use-cases/letters/delete-letter'
import { WrongIdFormat } from '../../../presentation/errors/wrong-id-format'

export class DeleteLetterController implements Controller {
  constructor (
    private readonly deleteLetter: DeleteLetter
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params

      return responseOK(await this.deleteLetter.delete(id))
    } catch (error) {
      if (error instanceof WrongIdFormat) {
        return badRequest(error)
      }
      return serverError(error)
    }
  }
}
