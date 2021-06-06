import { Controller, HttpRequest, HttpResponse } from './letter-protocols'
import { serverError, responseOK } from '../../helpers/http/http-helper'
import { SelectLetters } from '@/domain/use-cases/letters/select-letters'

export class SelectLettersController implements Controller {
  constructor (
    private readonly selectLetters: SelectLetters
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      return responseOK(await this.selectLetters.getAll())
    } catch (error) {
      return serverError(error)
    }
  }
}
