import { LetterSenderModel } from './letter-sender'

export interface LetterModelDto{
  sender: LetterSenderModel
  text: string
}
