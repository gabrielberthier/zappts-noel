import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  connection: null as MongoClient,

  connect: async function (uri: string) {
    this.connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.connection.db()
  },

  disconnect: async function () {
    await this.connection.close()
  },

  getCollection (name: string): Collection {
    return this.connection.db().collection(name)
  },

  mapCollection<T>(collection: any): T {
    const { _id, ...collectionUnderscoreID } = collection

    return Object.assign({}, collectionUnderscoreID, { id: _id })
  }

}
