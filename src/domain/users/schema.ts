import { gql } from 'apollo-server-express'

export const userTypeDefs = gql`
  type User @entity {
    id: ID! @id
    name: String! @column
    email: String! @column
    username: String! @column
    password: String! @column
  }

  input UserCreationParams {
    name: String!
    email: String!
    username: String!
    password: String!
  }

  extend type Mutation {
    signup(userData: UserCreationParams!): Boolean!
  }

  extend type Query {
    login(username: String!, password: String!): String!
  }
`
