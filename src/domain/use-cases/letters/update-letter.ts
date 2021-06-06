import { LetterModelDto } from '@/domain/models/add-letter-dto'
import { LetterModel } from '@/domain/models/letter'

export interface UpdateLetter{
  update (id: string, letterDto: LetterModelDto): Promise<LetterModel>
}
