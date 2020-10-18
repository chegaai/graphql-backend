import { Db } from 'mongodb'
import { Crypto } from '../lib/crypto'
import { JwtLib } from '../lib/jwt'
import { getEvents } from './events'
import { getUsers } from './users'

export const factory = async (db: Db, crypto: Crypto, jwt: JwtLib) => {
  const { eventTypeDefs, eventResolvers } = await getEvents(db)
  const { userTypeDefs, userResolvers } = await getUsers(db, crypto, jwt)

  return {
    typeDefs: [eventTypeDefs, userTypeDefs],
    resolvers: [eventResolvers, userResolvers]
  }
}
