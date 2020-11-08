import { MongoDbSessionRepository } from '../adapters/mongodb/mongodb-session-repository'
import { EVENT_REPOSITORY } from '../domain/ports/constants'

export const sessionRepositoryProvider = {
  provide: EVENT_REPOSITORY,
  useClass: MongoDbSessionRepository,
}
