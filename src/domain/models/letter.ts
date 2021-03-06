import { LetterSenderModel } from './letter-sender'

export interface LetterModel{
  id: string
  sender: LetterSenderModel
  text: string
  createdAt: Date
}
