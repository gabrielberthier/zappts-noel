import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = new BCryptAdapter()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const hashedPass = await sut.encrypt('any_value')
    console.log(hashedPass)
    expect(hashSpy).toHaveBeenLastCalledWith('any_value', 12)
  })
})
