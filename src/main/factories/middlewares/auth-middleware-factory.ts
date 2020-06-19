import { Middleware } from '../../../presentation/protocols'
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { makeDBLoadAccountByToken } from '../usecases/db-load-account-by-token/db-load-account-by-access-token'

export const makeAuthMiddleware = function (role?: string): Middleware {
  const middleware = new AuthMiddleware(makeDBLoadAccountByToken(), role)
  return middleware
}
