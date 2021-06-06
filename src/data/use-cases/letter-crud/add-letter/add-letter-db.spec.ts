import { AddLetterRepository } from '@/data/protocols/db/letter/add-letter-repository'
import { LetterModelDto } from '@/domain/models/add-letter-dto'
import { LetterModel } from '@/domain/models/letter'
import { AddLetterDb } from './add-letter-db'

interface SutTypes{
  sut: AddLetterDb
  addLetterRepository: AddLetterRepository
}

function sutFactory (): SutTypes {
  const addLetterRepository = addLetterRepositoryFactory()
  const sut = new AddLetterDb(addLetterRepository)
  return {
    sut,
    addLetterRepository
  }
}

function addLetterRepositoryFactory (): AddLetterRepository {
  class AddLetterRepositoryStub implements AddLetterRepository {
    async addLetter (model: LetterModelDto): Promise<LetterModel> {
      return await new Promise(resolve => resolve(null))
    }
  }

  return new AddLetterRepositoryStub()
}

function makeFakeData (): LetterModelDto {
  const data: LetterModelDto = {
    sender: {
      name: 'Maria Julia',
      surname: 'Nogueira Berthier',
      birthday: new Date(),
      contact: '98 99999-0000',
      cpf: '946546546',
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
  return data
}

describe('DBAddSurvey Use case', () => {
  it('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addLetterRepository } = sutFactory()
    const spy = jest.spyOn(addLetterRepository, 'addLetter')
    const addSurveyModel = makeFakeData()
    await sut.add(addSurveyModel)
    expect(spy).toBeCalledWith(addSurveyModel)
  })

  it('Should throw error if AddSurveyRepository throws', async () => {
    const { sut, addLetterRepository } = sutFactory()
    jest.spyOn(addLetterRepository, 'addLetter')
      .mockReturnValueOnce(new Promise(function (resolve, reject) {
        reject(new Error())
      }))
    const addSurveyModel = makeFakeData()
    const promiseRejected = sut.add(addSurveyModel)
    await expect(promiseRejected).rejects.toThrow()
  })
})
