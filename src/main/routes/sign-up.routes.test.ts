import request from 'supertest'
import app from '../config/app'

describe('Sign-up routes', () => {
  it('Should return an account on success', async () => {
    await request(app).post('/api/sign-up').send({
      name: 'El Gabus',
      email: 'gabsthier@gmail.com',
      password: '123456',
      passwordConfirm: '123456'
    }).expect({
      ok: 'ok?'
    })
  })
})
