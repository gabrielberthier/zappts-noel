import { CpfValidator } from '@/data/protocols/validators/cpf-validator'
import { cpf as cpfValidator } from 'cpf-cnpj-validator'

export class CpfValidatorAdapter implements CpfValidator {
  isValid (cpf: string): boolean {
    return cpfValidator.isValid(cpf)
  }
}
