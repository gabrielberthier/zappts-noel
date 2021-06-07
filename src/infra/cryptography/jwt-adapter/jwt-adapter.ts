import { TokenGenerator } from '../../../data/protocols/cryptography/token-generator'
import jwt from 'jsonwebtoken'
import { TokenReader } from '../../../data/protocols/cryptography/token-reader'

export class JWTAdapter implements TokenGenerator, TokenReader {
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

  async decrypt (token: string): Promise<string> {
    const value: any = jwt.verify(token, this.secret)

    return value
  }
}
