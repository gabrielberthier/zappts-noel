
import { LetterModel } from '@/domain/models/letter'

export interface SelectLetters{
  getAll (): Promise<LetterModel[]>
}
