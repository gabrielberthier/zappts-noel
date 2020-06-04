import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AuthenticationModel, Authentication } from '../../../domain/use-cases/authentication/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { exists } from '../../../utils/object-exists'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

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
    const account = await this.loadAccountByEmailRepository.load(auth.email)
    if (exists(account)) {
      const isValid = await this.hashComparer.compare(auth.password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
