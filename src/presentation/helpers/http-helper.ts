import { HttpResponse } from '../protocols'
import { ServerError } from '../errors'

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error.message
  }
}

export const serverError = function (): HttpResponse {
  return {
    statusCode: 500,
    body: new ServerError()
  }
}

export const responseOK = function (data: any): HttpResponse {
  return {
    statusCode: 200,
    body: data
  }
}
