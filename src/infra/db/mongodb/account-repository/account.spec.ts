// export interface AccountRepository{

// }
import { MongoHelper } from '../../mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account - Mongo Repository', () => {
  beforeAll(async function () {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await MongoHelper.disconnect()
  })

  beforeEach(async function () {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
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

  it('Should return an account loadByEmail', async () => {
    const sut = makeSut()
    await sut.addUserAccount({
      name: 'James Delos',
      email: 'james@delos.com',
      password: 'strongpassword'
    })
    const accountReturn = await sut.loadByEmail('james@delos.com')
    expect(accountReturn).toBeTruthy()
    expect(accountReturn.id).toBeTruthy()
    expect(accountReturn.name).toBe('James Delos')
    expect(accountReturn.email).toBe('james@delos.com')
    expect(accountReturn.password).toBe('strongpassword')
  })

  it('Should return an account loadByEmail', async () => {
    const sut = makeSut()
    await sut.addUserAccount({
      name: 'James Delos',
      email: 'james@delos.com',
      password: 'strongpassword'
    })
    const accountReturn = await sut.loadByEmail('james@evergreen.com')
    expect(accountReturn).toBeFalsy()
  })
})
