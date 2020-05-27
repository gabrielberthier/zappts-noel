import { MongoClient, Collection } from 'mongodb'

class MongoHelperClass {
  private connection: MongoClient
  private uri: string

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.connection.db()
  }

  async disconnect (): Promise<void> {
    await this.connection.close()
    this.connection = null
  }

  async getCollection (name: string): Promise<Collection> {
    if ((this.connection === null || !this.connection.isConnected())) {
      await this.connect(this.uri)
    }
    return this.connection.db().collection(name)
  }

  mapCollection<T>(collection: any): T {
    const { _id, ...collectionUnderscoreID } = collection

    return Object.assign({}, collectionUnderscoreID, { id: _id })
  }
}

export const MongoHelper = new MongoHelperClass()
