import { EventCreationParams } from '../types/graphql'
import { EventRepository } from './repository'

const find = (repository: EventRepository) => async (id?: string) => {
  if (id) {
    return repository.findById(id).then((result) => (result ? [result] : []))
  }

  return repository.findAll()
}

const create = (repository: EventRepository) => async ({ title }: EventCreationParams) =>
  repository.create({ title })

export const getService = (repository: EventRepository) => ({
  find: find(repository),
  create: create(repository)
})

export type EventService = ReturnType<typeof getService>
