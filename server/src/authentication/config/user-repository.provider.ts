import { MongoDbUserRepository } from '../infrastructure/mongodb/mongodb-user-repository'
import { USER_REPOSITORY } from '../domain/ports/constants'

export const usersRepositoryProvider = {
  provide: USER_REPOSITORY,
  useClass: MongoDbUserRepository,
}
