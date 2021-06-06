import { Address } from './address'

export interface LetterSender{
  name: string
  surname: string
  birthday: Date
  contact: string
  cpf: string
  address: Address
}
