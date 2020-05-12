import { HttpRequest, HttpResponse } from '../../protocols/http'
import check from '../../utils/stringchecker'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    let er: Error
    if (check(httpRequest.body.name)) {
      er = new Error('Missing param name')
    } else if (check(httpRequest.body.email)) {
      er = new Error('Missing param email')
    }
    return {
      statusCode: 400,
      body: er
    }
  }
}
