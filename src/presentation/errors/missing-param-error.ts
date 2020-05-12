export class MissingParamError extends Error {
  constructor (messagemParam: string) {
    super(`Missing param: ${messagemParam}`)
    this.name = 'MissingParamError'
  }
}
