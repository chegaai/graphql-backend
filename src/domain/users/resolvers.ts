import { DeepPartial } from '../../lib/types/DeepPartial'
import { Resolvers } from '../types/graphql'
import { UserService } from './service'

export const getResolvers = (service: UserService): DeepPartial<Resolvers> => ({
  User: {
    password: () => ''
  },

  Mutation: {
    signup: (_, { userData }) => service.create(userData)
  },

  Query: {
    login: (_, { username, password }) => service.login(username, password)
  }
})
