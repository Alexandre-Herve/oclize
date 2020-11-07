import { MongoDbSessionRepository } from '../adapters/mongodb/mongodb-session-repository'

export const sessionRepositoryProvider = {
  provide: 'EVENT_REPOSITORY',
  useClass: MongoDbSessionRepository,
}
