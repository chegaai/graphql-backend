import { Collection, Db } from 'mongodb'
import { UserCreationParams, UserDbObject } from '../types/graphql'

type UserCollection = Collection<UserDbObject>

const findByUsernameOrEmail = (collection: UserCollection) => (usernameOrEmail: string) =>
  collection.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] })

const existsBy = (collection: UserCollection, query: Record<string, any>) =>
  collection.countDocuments(query).then((result) => result > 0)

const existsByEmail = (collection: UserCollection) => (email: string) =>
  existsBy(collection, { email })

const existsByUsername = (collection: UserCollection) => (username: string) =>
  existsBy(collection, { username })

const create = (collection: UserCollection) => ({ password, ...userData }: UserCreationParams) =>
  collection.insertOne({ password, ...userData }).then(({ insertedId }) => ({
    _id: insertedId,
    ...userData
  }))

export const getRepository = (db: Db) => {
  const collection = db.collection('users')

  return {
    findByUsernameOrEmail: findByUsernameOrEmail(collection),
    existsByEmail: existsByEmail(collection),
    existsByUsername: existsByUsername(collection),
    create: create(collection)
  }
}

export type UserRepository = ReturnType<typeof getRepository>
