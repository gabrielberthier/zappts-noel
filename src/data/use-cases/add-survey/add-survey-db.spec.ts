import {
  AddSurveyModel,
  DBAddSurvey,
  AddSurveyRepository
} from './add-survey-db-protocols'

interface SutTypes{
  sut: DBAddSurvey
  addSurveyRepository: AddSurveyRepository
}

function sutFactory (): SutTypes {
  const addSurveyRepository = addSurveyRepositoryFactory()
  const sut = new DBAddSurvey(addSurveyRepository)
  return {
    sut,
    addSurveyRepository
  }
}

function addSurveyRepositoryFactory (): AddSurveyRepository {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async addSurvey (addSurveyModel: AddSurveyModel): Promise<void> {
      return await Promise.resolve()
    }
  }

  const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
  return addSurveyRepositoryStub
}

function makeFakeSurveyData (): AddSurveyModel {
  const addSurveyModel: AddSurveyModel = {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
  return addSurveyModel
}

describe('DBAddSurvey Use case', () => {
  it('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepository } = sutFactory()
    const spy = jest.spyOn(addSurveyRepository, 'addSurvey')
    const addSurveyModel = makeFakeSurveyData()
    await sut.add(addSurveyModel)
    expect(spy).toBeCalledWith(addSurveyModel)
  })
})
