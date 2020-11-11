import { MongoDbSessionRepository } from '../infrastructure/mongodb/mongodb-session-repository'
import { SESSION_REPOSITORY } from '../domain/ports/constants'

export const sessionRepositoryProvider = {
  provide: SESSION_REPOSITORY,
  useClass: MongoDbSessionRepository,
}
