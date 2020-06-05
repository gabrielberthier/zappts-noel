import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './acount-mongo-repository'
import { AccountModel } from '../../../../domain/models/account'

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
    const accountReturn = await sut.loadAccountUsingEmail('james@delos.com')
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
    const accountReturn = await sut.loadAccountUsingEmail('james@evergreen.com')
    expect(accountReturn).toBeFalsy()
  })

  it('Should update account\'s access token on successful onUpdateAccessToken', async () => {
    const sut = makeSut()
    const res: AccountModel = await sut.addUserAccount({
      name: 'James Delos',
      email: 'james@delos.com',
      password: 'strongpassword'
    })
    await sut.updateAccessToken(res.id, 'any_token')
    const accountReturn = await sut.loadAccountUsingEmail('james@delos.com') as any
    expect(accountReturn.accessToken).toBeTruthy()
  })
})
