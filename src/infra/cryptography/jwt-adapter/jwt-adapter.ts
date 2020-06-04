import { TokenGenerator } from '../../../data/protocols/cryptography/token-generator'
import jwt from 'jsonwebtoken'

export class JWTAdapter implements TokenGenerator {
  private readonly secret: string

  constructor (secret: string) {
    this.secret = secret
  }

  async generate (id: string): Promise<string> {
    const payload: any = {
      id
    }
    return jwt.sign(payload, this.secret)
  }
}
