import { MongoClient } from 'mongodb'
import { AppConfig } from '../config'

export const connect = (config: AppConfig['mongodb']) =>
  MongoClient.connect(config.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then((connection) => connection.db(config.dbName))
