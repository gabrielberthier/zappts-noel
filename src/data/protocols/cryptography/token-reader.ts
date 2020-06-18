export interface TokenReader{
  decrypt(token: string): Promise<string>
}
