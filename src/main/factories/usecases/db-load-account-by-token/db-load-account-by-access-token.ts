import { DBLoadAccountByToken } from '../../../../data/use-cases/load-account-by-token/db-load-account-by-token'
import { JWTAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { environment } from '../../../config/environment/env'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/acount-mongo-repository'
import { LoadAccountByAccessToken } from '../../../../domain/use-cases/load-account-by-access-token'

export const makeDBLoadAccountByToken = function (): LoadAccountByAccessToken {
  const jwtDecrypt = new JWTAdapter(environment.jwt_secret)
  const repository = new AccountMongoRepository()
  const loadAccountByAccessToken = new DBLoadAccountByToken(jwtDecrypt, repository)
  return loadAccountByAccessToken
}
