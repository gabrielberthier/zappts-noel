import { Controller, HttpRequest, HttpResponse } from './letter-protocols'
import { serverError, responseOK } from '../../helpers/http/http-helper'
import { DeleteLetter } from '@/domain/use-cases/letters/delete-letter'

export class DeleteLetterController implements Controller {
  constructor (
    private readonly deleteLetter: DeleteLetter
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params

      return responseOK(await this.deleteLetter.delete(id))
    } catch (error) {
      return serverError(error)
    }
  }
}
