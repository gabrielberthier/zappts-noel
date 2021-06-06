import { LetterModel } from '@/domain/models/letter'

export interface SelectLettersRepository{
  getAll (): Promise<LetterModel[]>
}
