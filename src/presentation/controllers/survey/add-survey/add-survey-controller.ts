import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { Validation } from '../../../protocols/validation'
import { badRequest } from '../../../helpers/http/http-helper'
import { exists } from '../../../../utils/object-exists'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const error: Error = this.validation.validate(request.body)
    if (exists(error)) {
      return badRequest(error)
    }

    return await Promise.resolve(null)
  }
}
