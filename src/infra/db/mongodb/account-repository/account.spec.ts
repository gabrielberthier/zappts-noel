// export interface AccountRepository{

// }
import { MongoHelper } from '../../mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from './account'
import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'

describe('Account - Mongo Repository', () => {
  beforeAll(async function () {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await MongoHelper.disconnect()
  })

  beforeEach(async function () {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AddAccountRepository => {
    const sut = new AccountMongoRepository()
    return sut
  }

  it('Should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.addUserAccount({
      name: 'James Delos',
      email: 'james@delos.com',
      password: 'strongpassword'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('James Delos')
    expect(account.email).toBe('james@delos.com')
    expect(account.password).toBe('strongpassword')
  })
})
