import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/cryptography/encrypter'

export class BCryptAdapter implements Encrypter {
  private readonly salt: number

  constructor (salt: number = 12) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
