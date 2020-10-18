import { gql } from 'apollo-server-express'

export const eventTypeDefs = gql`
  type Event @entity {
    id: ID! @id
    title: String @column
  }

  input EventCreationParams {
    title: String!
  }

  extend type Query {
    events(id: ID): [Event]! @auth(required: true)
  }

  extend type Mutation {
    addEvent(eventData: EventCreationParams!): Event!
  }
`
