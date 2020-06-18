import jwt from 'jsonwebtoken'
import { JWTAdapter } from './jwt-adapter'

function sutMaker (): JWTAdapter {
  return new JWTAdapter('secret')
}

describe('JWT Adapter', () => {
  describe('Sign', () => {
    it('Should call sign with correct values', async () => {
      const sut = sutMaker()
      const jwtSpy = jest.spyOn(jwt, 'sign')
      await sut.generate('new_value')
      expect(jwtSpy).toBeCalledWith({ id: 'new_value' }, 'secret')
    })

    it('Should return a token on success', async () => {
      const sut = sutMaker()
      const accessToken = await sut.generate('new_value')
      console.log(accessToken)
      expect(accessToken).toBeTruthy()
    })

    it('Should throw exception in a case of error', async () => {
      const sut = sutMaker()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.generate('new_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('Verify', () => {

  })
})
