import { LetterModel } from '@/domain/models/letter'
import { DeleteLetter } from '@/domain/use-cases/letters/delete-letter'
import { DeleteLetterRepository } from '@/data/protocols/db/letter/delete-letter-repository'

export class DeleteLetterDB implements DeleteLetter {
  constructor (private readonly repository: DeleteLetterRepository) {
  }

  async delete (id: string): Promise<LetterModel> {
    return await this.repository.deleteLetter(id)
  }
}
