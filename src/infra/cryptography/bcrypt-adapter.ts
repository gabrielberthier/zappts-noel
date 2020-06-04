import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/cryptography/hasher'

export class BCryptAdapter implements Hasher {
  private readonly salt: number

  constructor (salt: number = 12) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
