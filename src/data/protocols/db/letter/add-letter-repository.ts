import { LetterModelDto } from '@/domain/models/add-letter-dto'
import { LetterModel } from '@/domain/models/letter'

export interface AddLetterRepository{
  addLetter (letterModelDto: LetterModelDto): Promise<LetterModel>
}
