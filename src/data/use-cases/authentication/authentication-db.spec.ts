import { AuthenticationModel } from '../../../domain/use-cases/authentication/authentication'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DBAuthentication } from './authentication-db'

describe('DB Authentication use case', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          email: 'any_email',
          id: 'any_id',
          name: 'any_name',
          password: 'any_pass'
        }
        return await new Promise(resolve => resolve(account))
      }
    }

    const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
    const sut = new DBAuthentication(loadAccountByEmailRepository)
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    const auth: AuthenticationModel = {
      email: 'john@mail.com',
      password: 'any_pass'
    }
    await sut.auth(auth)
    expect(loadSpy).toHaveBeenCalledWith(auth.email)
  })
})
