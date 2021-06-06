import { Validation, Controller, HttpRequest, HttpResponse, AddLetter } from './letter-protocols'
import { badRequest, serverError, responseOK } from '../../helpers/http/http-helper'
import { exists } from '../../../utils/object-exists'

export class AddLetterController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addLetter: AddLetter
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const error: Error = this.validation.validate(request.body)

      if (exists(error)) {
        return badRequest(error)
      }

      const { sender, text } = request.body
      await this.addLetter.add({
        sender,
        text
      })

      return responseOK({ message: 'Cartinha registrada com sucesso!' })
    } catch (error) {
      return serverError(error)
    }
  }
}
