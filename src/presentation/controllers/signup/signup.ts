import { badRequest, serverError, responseOK, forbbiden } from '../../helpers/http/http-helper'
import { exists } from '../../../utils/object-exists'
import { Authentication, HttpRequest, AddAccount, HttpResponse, Controller, Validation } from './signup-protocols'
import { EmailInUseError } from '../../errors'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (addAccount: AddAccount, validation: Validation, auth: Authentication) {
    this.addAccount = addAccount
    this.validation = validation
    this.authentication = auth
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error: Error = this.validation.validate(httpRequest.body)
      if (exists(error)) {
        return badRequest(error)
      }

      const { name, password, email } = httpRequest.body

      const account = await this.addAccount.addUserAccount({
        name, password, email
      })

      if (!exists(account)) {
        return forbbiden(new EmailInUseError())
      }

      const token = await this.authentication.auth({
        email, password
      })

      return responseOK({ accessToken: token })
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
