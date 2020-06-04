import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

const salt = 12
const makeSut = (): BCryptAdapter => {
  const sut = new BCryptAdapter(salt)
  return sut
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenLastCalledWith('any_value', 12)
  })
})
