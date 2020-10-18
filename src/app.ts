import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-express'
import express from 'express'
import { AppConfig } from './config'
import * as domain from './domain'
import { getCrypto } from './lib/crypto'
import * as database from './lib/database'
import { getJwtLib } from './lib/jwt'
import auth, { authDirective } from './presentation/directives/auth'

export const start = async (config: AppConfig) => {
  const app = express()

  const db = await database.connect(config.mongodb)
  const crypto = getCrypto(config.crypto)
  const jwt = getJwtLib(config.jwt)

  const { typeDefs, resolvers } = await domain.factory(db, crypto, jwt)

  const schema = makeExecutableSchema({
    typeDefs: [
      DIRECTIVES,
      authDirective,
      gql`
        type Query {
          _empty: String
        }
        type Mutation {
          _empty: String
        }
      `,
      ...typeDefs
    ],
    resolvers: [...resolvers],
    schemaDirectives: {
      ...auth
    }
  })

  const server = new ApolloServer({
    schema,
    tracing: true,
    context: ({ req, res }) => {
      return { config, req, res }
    },
    formatError: (err: any) => {
      delete err.extensions.exception
      return err
    }
  })

  server.applyMiddleware({ app })

  app.listen({ port: 3000 }, () => {
    console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
  })
}
