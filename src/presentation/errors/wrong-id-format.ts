export class WrongIdFormat extends Error {
  constructor () {
    super('Id passed to resource has a wrong format')
    this.name = 'WrongIdFormat'
  }
}
