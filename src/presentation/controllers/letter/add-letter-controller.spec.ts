import { Validation, HttpRequest, HttpResponse } from './letter-protocols'
import { AddLetterController } from './add-letter-controller'
import { badRequest, serverError, responseOK } from '../../helpers/http/http-helper'
import { AddLetter } from '@/domain/use-cases/letters/add-letter'
import { LetterModel } from '@/domain/models/letter'

interface SutTypes {
  sut: AddLetterController
  validation: Validation
  addLetter: AddLetter
}

function addLetterFactory (): AddLetter {
  class AddSurveyStub implements AddLetter {
    async add (model: LetterModel): Promise<LetterModel> {
      return {
        id: '',
        sender: {
          name: 'Maria Julia',
          surname: 'Nogueira Berthier',
          birthday: new Date(),
          contact: '98 99999-0000',
          cpf: '',
          address: {
            uf: 'MA',
            city: 'Sao Luis',
            cep: '65066-330',
            number: '145',
            complement: '',
            place: 'Rua dos Bobos'
          }
        },
        text: 'Dear, Santa...',
        createdAt: new Date()
      }
    }
  }

  return new AddSurveyStub()
}

const sutFactory = function (): SutTypes {
  const validation = validationFactory()
  const addLetter = addLetterFactory()
  const sut = new AddLetterController(validation, addLetter)
  return {
    sut, validation, addLetter
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
      sender: {
        name: 'Maria Julia',
        surname: 'Nogueira Berthier',
        birthday: new Date(),
        contact: '98 99999-0000',
        cpf: '',
        address: {
          uf: 'MA',
          city: 'Sao Luis',
          cep: '65066-330',
          number: '145',
          complement: '',
          place: 'Rua dos Bobos'
        }
      },
      text: 'Dear, Santa...'
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

  it('Should call AddLetter with correct values', async () => {
    const { sut, addLetter } = sutFactory()
    const addspy = jest.spyOn(addLetter, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addspy).toBeCalledWith(httpRequest.body)
  })

  it('Should return 500 if AddSurvey throws', async () => {
    const { sut, addLetter } = sutFactory()
    jest.spyOn(addLetter, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const httpRequest = makeFakeRequest()
    const response: HttpResponse = await sut.handle(httpRequest)
    expect(response).toEqual(serverError(new Error()))
  })

  it('Should return 200 on success', async () => {
    const { sut } = sutFactory()
    const httpRequest = makeFakeRequest()
    const response: HttpResponse = await sut.handle(httpRequest)
    expect(response).toEqual(responseOK({ message: 'Cartinha registrada com sucesso!' }))
  })
})
