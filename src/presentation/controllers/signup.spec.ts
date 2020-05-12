import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', function () {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'johndee@email.com',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param name'))
  })

  test('Should return 400 if no email is provided', function () {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'johndee@email.com',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param email'))
  })
})
