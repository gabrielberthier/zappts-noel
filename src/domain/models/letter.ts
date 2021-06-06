import { LetterSender } from './letter-sender'

export interface Letter{
  sender: LetterSender
  text: string
  createdAt: Date
}
