import {
  AuthenticationModel,
  LoadAccountByEmailRepository,
  HashComparer,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './authentication-db-protocols'
import { Authentication } from '../../../domain/use-cases/authentication/authentication'
import { exists } from '../../../utils/object-exists'

export class DBAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (auth: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadAccountUsingEmail(auth.email)
    if (exists(account)) {
      const isValid = await this.hashComparer.compare(auth.password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
