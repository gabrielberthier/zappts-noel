export class OptionalParamError extends Error {
  constructor (messagemParam: string) {
    super(`Optional param: ${messagemParam} has no valid format`)
    this.name = 'OptionalParamError'
  }
}
