import { Validation } from '../../../../presentation/protocols/validation'
import { makeLoginValidation } from './login-validation-factory'

const makeValidation = (): Validation => {
  return makeLoginValidation()
}

describe('Description', () => {
  it('Test', () => {
    makeValidation()
    expect(1).toBe(1)
  })
})
