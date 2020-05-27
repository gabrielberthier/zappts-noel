import { HttpResponse } from '../protocols'
import { ServerError } from '../errors'

export const badRequest = (error: Error): HttpResponse => {
  console.log(error.message)
  return {
    statusCode: 400,
    body: error
  }
}

export const serverError = function (error: Error): HttpResponse {
  return {
    statusCode: 500,
    body: new ServerError(error)
  }
}

export const responseOK = function (data: any): HttpResponse {
  return {
    statusCode: 200,
    body: data
  }
}
