import { HttpRequest, HttpResponse } from '../../protocols/http'
import check from '../../utils/stringchecker'
import { MissingParamError } from '../errors/missing-param-error'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    let er: Error
    if (check(httpRequest.body.name)) {
      er = new MissingParamError('name')
    } else if (check(httpRequest.body.email)) {
      er = new MissingParamError('email')
    }
    return {
      statusCode: 400,
      body: er
    }
  }
}
