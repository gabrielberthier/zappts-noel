import { LetterSenderModel } from './letter-sender'

export interface LetterModel{
  id: string|null
  sender: LetterSenderModel
  text: string
  createdAt: Date
}
