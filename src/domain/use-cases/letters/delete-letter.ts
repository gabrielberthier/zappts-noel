import { LetterModel } from '@/domain/models/letter'

export interface DeleteLetter{
  delete (id: string): Promise<LetterModel>
}
