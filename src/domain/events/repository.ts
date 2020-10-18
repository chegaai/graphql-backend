import { Collection, Db, ObjectId } from 'mongodb'
import { EventCreationParams, EventDbObject } from '../types/graphql'

type EventCollection = Collection<EventDbObject>

const findById = (collection: EventCollection) => async (id: string | ObjectId) =>
  ObjectId.isValid(id) ? collection.findOne({ _id: new ObjectId(id) }) : null

const findAll = (collection: EventCollection) => async () => collection.find().toArray()

const create = (collection: EventCollection) => async ({ title }: EventCreationParams) =>
  collection.insertOne({ title }).then(({ insertedId }) => ({
    _id: insertedId,
    title
  }))

export const getRepository = (db: Db) => {
  const collection = db.collection('events')

  return {
    findById: findById(collection),
    findAll: findAll(collection),
    create: create(collection)
  }
}

export type EventRepository = ReturnType<typeof getRepository>
