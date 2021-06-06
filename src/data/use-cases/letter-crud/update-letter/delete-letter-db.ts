import { LetterModel } from '@/domain/models/letter'
import { UpdateLetter } from '@/domain/use-cases/letters/update-letter'
import { UpdateLetterRepository } from '@/data/protocols/db/letter/update-letter-repository'
import { LetterModelDto } from '@/domain/models/add-letter-dto'

export class UpdateLetterDB implements UpdateLetter {
  constructor (private readonly repository: UpdateLetterRepository) {
  }

  async update (id: string, letterDto: LetterModelDto): Promise<LetterModel> {
    return await this.repository.updateLetter(id, letterDto)
  }
}
