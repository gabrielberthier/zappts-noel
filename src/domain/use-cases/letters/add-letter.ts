import { LetterModel } from '@/domain/models/letter'

export interface AddLetter{
  add (letter: LetterModel): Promise<LetterModel>
}
