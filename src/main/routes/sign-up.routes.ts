import { Router, Request, Response } from 'express'

function routefy (router: Router): void {
  router.post('/sign-up', function (req: Request, res: Response) {
    res.json({
      ok: 'ok?'
    })
  })
}

export default routefy
