import { Address } from './address'

export interface LetterSenderModel{
  id: string|null
  name: string
  surname: string
  birthday: Date
  contact: string
  cpf: string
  address: Address
}
