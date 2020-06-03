import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AuthenticationModel, Authentication } from '../../../domain/use-cases/authentication/authentication'

export class DBAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (auth: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(auth.email)
    return ''
  }
}
