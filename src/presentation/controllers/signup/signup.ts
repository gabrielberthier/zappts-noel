import { HttpRequest, HttpResponse, Controller } from '../../protocols'
import { badRequest, serverError, responseOK } from '../../helpers/http/http-helper'
import { AddAccount } from '../../../domain/use-cases/add-account'
import { Validation } from '../../helpers/validators/validation'
import { exists } from '../../../utils/object-exists'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
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

      return responseOK(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
