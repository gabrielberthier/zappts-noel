import { MongoClient } from 'mongodb'

export const MongoHelper = {
  connection: null as MongoClient,

  connect: async function (uri: string) {
    this.connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.connection.db()
  },

  disconnect: async function () {
    await this.connection.close()
  }
}
