import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', function () {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'John May Dee',
        email: 'johndee@email.com',
        password: 'testablepassword',
        passwordConfirm: 'testablepassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
