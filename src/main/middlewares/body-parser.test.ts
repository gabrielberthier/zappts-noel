import request from 'supertest'
import app from '../config/app'

describe('Body parser middleware', () => {
  it('Should parse json body', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app).post('/test_body_parser').send({
      name: 'EL GABS'
    }).expect({
      name: 'EL GABS'
    })
  })
})
