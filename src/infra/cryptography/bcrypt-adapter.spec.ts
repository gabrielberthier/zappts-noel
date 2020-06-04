import bcrypt, { hash, compare } from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

const salt = 12
const makeSut = (): BCryptAdapter => {
  const sut = new BCryptAdapter(salt)
  return sut
}

jest.mock('bcrypt', function () {
  return {
    async hash (): Promise<string> {
      return await new Promise(resolve => resolve('hash'))
    },
    async compare (): Promise<boolean> {
      return true
    }
  }
})

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenLastCalledWith('any_value', 12)
  })

  test('Should call compare with correct values', async function () {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toBeCalledWith('any_value', 'any_hash')
  })
})
