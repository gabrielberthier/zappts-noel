import { LetterModelDto } from '@/domain/models/add-letter-dto'
import { LetterModel } from '@/domain/models/letter'
import { AddLetter } from '@/domain/use-cases/letters/add-letter'
import { AddLetterRepository } from '@/data/protocols/db/letter/add-letter-repository'

export class AddLetterDb implements AddLetter {
  constructor (private readonly repository: AddLetterRepository) {
  }

  async add (letterDto: LetterModelDto): Promise<LetterModel> {
    const letterModel = await this.repository.addLetter(letterDto)

    return letterModel
  }
}
