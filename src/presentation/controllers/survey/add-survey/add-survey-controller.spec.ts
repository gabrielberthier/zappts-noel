import { Validation, AddSurvey, HttpRequest, HttpResponse } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest, serverError, noContent } from '../../../helpers/http/http-helper'
import { AddSurveyModel } from '../../../../domain/use-cases/add-survey'

interface SutTypes {
  sut: AddSurveyController
  validation: Validation
  addSurvey: AddSurvey
}

const sutFactory = function (): SutTypes {
  const validation = validationFactory()
  const addSurvey = addSurveyFactory()
  const sut = new AddSurveyController(validation, addSurvey)
  return {
    sut, validation, addSurvey
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

function addSurveyFactory (): AddSurvey {
  class AddSurveyStub implements AddSurvey {
    async add (addSurveyModel: AddSurveyModel): Promise<void> {
      return await Promise.resolve()
    }
  }

  const validation = new AddSurveyStub()
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
    const response: HttpResponse = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new Error()))
  })

  it('Should AddSurvey with correct values', async () => {
    const { sut, addSurvey } = sutFactory()
    const addspy = jest.spyOn(addSurvey, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addspy).toBeCalledWith(httpRequest.body)
  })

  it('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurvey } = sutFactory()
    jest.spyOn(addSurvey, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const httpRequest = makeFakeRequest()
    const response: HttpResponse = await sut.handle(httpRequest)
    expect(response).toEqual(serverError(new Error()))
  })

  it('Should return 204 on success', async () => {
    const { sut } = sutFactory()
    const httpRequest = makeFakeRequest()
    const response: HttpResponse = await sut.handle(httpRequest)
    expect(response).toEqual(noContent())
  })
})
