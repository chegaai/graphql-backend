import { IResolvers } from 'apollo-server-express'
import { Db } from 'mongodb'
import { Crypto } from '../../lib/crypto'
import { JwtLib } from '../../lib/jwt'
import { getRepository } from './repository'
import { getResolvers } from './resolvers'
import { userTypeDefs } from './schema'
import { getService } from './service'

export const getUsers = (db: Db, crypto: Crypto, jwt: JwtLib) => {
  const repository = getRepository(db)
  const service = getService(repository, crypto, jwt)
  const userResolvers = getResolvers(service) as IResolvers

  return { userTypeDefs, userResolvers }
}
