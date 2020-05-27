export class ServerError extends Error {
  constructor (error: Error) {
    super('Internal Server error')
    this.name = 'ServerError'
    this.stack = error.stack
    this.message = error.message
  }
}
