import { Address } from './address'

export interface LetterSenderModel{
  name: string
  surname: string
  birthday: Date
  contact: string
  cpf: string
  address: Address
}
