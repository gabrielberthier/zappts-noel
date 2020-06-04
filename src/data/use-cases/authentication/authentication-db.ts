import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AuthenticationModel, Authentication } from '../../../domain/use-cases/authentication/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { exists } from '../../../utils/object-exists'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'

export class DBAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer, tokenGenerator: TokenGenerator) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth (auth: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(auth.email)
    if (exists(account)) {
      const isValid = await this.hashComparer.compare(auth.password, account.password)
      if (isValid) { return await this.tokenGenerator.generate(account.id) }
    }
    return null
  }
}
