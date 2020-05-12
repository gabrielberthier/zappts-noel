export class InvalidParamError extends Error {
  constructor (messagemParam: string) {
    super(`Invalid param: ${messagemParam}`)
    this.name = 'InvalidParamError'
  }
}
