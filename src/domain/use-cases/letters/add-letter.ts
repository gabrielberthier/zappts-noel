import { LetterModelDto } from '@/domain/models/add-letter-dto'
import { LetterModel } from '@/domain/models/letter'

export interface AddLetter{
  add (letter: LetterModelDto): Promise<LetterModel>
}
