import { HttpRequest } from '../../../protocols'
import { AddSurveyController } from './add-survey-controller'
import { Validation } from '../../../protocols/validation'
import { badRequest } from '../../../helpers/http/http-helper'

interface SutTypes {
  sut: AddSurveyController
  validation: Validation
}

const sutFactory = function (): SutTypes {
  const validation = validationFactory()
  const sut = new AddSurveyController(validation)
  return {
    sut, validation
  }
}

function validationFactory (): Validation {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  const validation = new ValidationStub()
  return validation
}

function makeFakeRequest (): HttpRequest {
  const httpRequest: HttpRequest = {
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  }
  return httpRequest
}

describe('Add Survey Controller', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validation } = sutFactory()
    const spyValidation = jest.spyOn(validation, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(spyValidation).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if validation fails', async () => {
    const { sut, validation } = sutFactory()
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new Error()))
  })
})
