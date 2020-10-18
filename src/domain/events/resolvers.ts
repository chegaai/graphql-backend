import { DeepPartial } from '../../lib/types/DeepPartial'
import { Resolvers } from '../types/graphql'
import { EventService } from './service'

export const getResolvers = (service: EventService): DeepPartial<Resolvers> => ({
  Event: {
    id: (parent) => parent._id.toHexString()
  },

  Mutation: {
    addEvent: (_, { eventData }) => service.create(eventData)
  },

  Query: {
    events: (_, { id }) => service.find(id)
  }
})
