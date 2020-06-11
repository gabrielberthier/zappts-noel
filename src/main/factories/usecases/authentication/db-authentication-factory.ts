import { Authentication } from '../../../../domain/use-cases/authentication/authentication'
import { DBAuthentication } from '../../../../data/use-cases/authentication/authentication-db'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/acount-mongo-repository'
import { BCryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JWTAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { environment } from '../../../config/environment/env'

export const makeDBAuthenticationFactory = function (): Authentication {
  const accountMongoRepository = new AccountMongoRepository()
  const bCryptAdapter = new BCryptAdapter()
  const jwtAdapter = new JWTAdapter(environment.jwt_secret)
  const accountMongoRepositor = new AccountMongoRepository()
  const authentication = new DBAuthentication(
    accountMongoRepository,
    bCryptAdapter,
    jwtAdapter,
    accountMongoRepositor
  )
  return authentication
}
