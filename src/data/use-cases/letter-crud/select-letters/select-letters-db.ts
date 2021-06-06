import { LetterModel } from '@/domain/models/letter'
import { SelectLetters } from '@/domain/use-cases/letters/select-letters'
import { SelectLettersRepository } from '@/data/protocols/db/letter/select-letter-repository'

export class SelectLettersDB implements SelectLetters {
  constructor (private readonly repository: SelectLettersRepository) {
  }

  async getAll (): Promise<LetterModel[]> {
    const letters = await this.repository.getAll()

    return letters
  }
}
