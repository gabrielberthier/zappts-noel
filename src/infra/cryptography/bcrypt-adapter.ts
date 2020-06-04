import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/cryptography/hasher'
import { HashComparer } from '../../data/protocols/cryptography/hash-comparer'

export class BCryptAdapter implements Hasher, HashComparer {
  private readonly salt: number

  constructor (salt: number = 12) {
    this.salt = salt
  }

  async compare (password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
