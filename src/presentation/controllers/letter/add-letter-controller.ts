import { Validation, Controller, HttpRequest, HttpResponse, AddLetter } from './letter-protocols'
import { badRequest, serverError, responseOK, forbidden } from '../../helpers/http/http-helper'
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
      const letterSaved = await this.addLetter.add({
        sender,
        text
      })

      if (exists(letterSaved)) {
        return responseOK({ message: 'Cartinha registrada com sucesso!' })
      }

      return forbidden(new Error('Já existe uma carta cadastrada com este cpf'))
    } catch (error) {
      return serverError(error)
    }
  }
}
