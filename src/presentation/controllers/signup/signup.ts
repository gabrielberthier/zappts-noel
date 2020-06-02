import { HttpRequest, HttpResponse, Controller } from '../../protocols'
import empty from '../../../utils/empty-string'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, responseOK } from '../../helpers/http-helper'
import { AddAccount } from '../../../domain/use-cases/add-account'
import { Validation } from '../../helpers/validators/validation'

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
      if (!(error === null || error === undefined)) {
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
