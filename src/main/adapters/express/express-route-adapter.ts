import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'
import { Request, Response } from 'express'
import { exists } from '../../../utils/object-exists'

export const adaptRoute = (controller: Controller) => {
  return async function (req: Request, res: Response) {
    const body = exists(req.body) ? req.body : {}
    const params = exists(req.params) ? req.params : {}

    const httpRequest: HttpRequest = {
      body, params
    }

    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
