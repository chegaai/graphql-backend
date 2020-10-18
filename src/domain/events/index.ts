import { IResolvers } from 'apollo-server-express'
import { Db } from 'mongodb'
import { getRepository } from './repository'
import { getResolvers } from './resolvers'
import { eventTypeDefs } from './schema'
import { getService } from './service'

export const getEvents = (db: Db) => {
  const repository = getRepository(db)
  const service = getService(repository)
  const eventResolvers = getResolvers(service) as IResolvers

  return { eventTypeDefs, eventResolvers }
}
