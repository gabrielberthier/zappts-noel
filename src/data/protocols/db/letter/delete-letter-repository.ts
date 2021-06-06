import { LetterModel } from '@/domain/models/letter'

export interface DeleteLetterRepository{
  deleteLetter (id: string): Promise<LetterModel>
}
