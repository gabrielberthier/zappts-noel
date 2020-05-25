import request from 'supertest'
import app from '../config/app'

describe('CORS middleware', () => {
  it('Should enable CORS', async () => {
    app.get('/', (req, res) => {
      res.send()
    })
    await request(app).get('/').expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Headers', '*')
      .expect('Access-Control-Allow-Methods', '*')
  })
})
