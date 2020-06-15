import { Validation, Controller, HttpRequest, HttpResponse, AddSurvey } from './add-survey-controller-protocols'
import { badRequest } from '../../../helpers/http/http-helper'
import { exists } from '../../../../utils/object-exists'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation, private readonly addSurvey: AddSurvey) {
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const error: Error = this.validation.validate(request.body)
    if (exists(error)) {
      return badRequest(error)
    }
    const { question, answers } = request.body
    await this.addSurvey.add({
      question, answers
    })

    return null
  }
}
