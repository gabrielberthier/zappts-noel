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

  it('Should return an account on success', async () => {
    const sut = new AccountMongoRepository()
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
