import { LetterModelDto } from '@/domain/models/add-letter-dto'
import { LetterModel } from '@/domain/models/letter'

export interface UpdateLetterRepository{
  updateLetter (id: string, letter: LetterModelDto): Promise<LetterModel>
}
