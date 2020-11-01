import { MongoDbUserRepository } from '../adapters/mongodb/mongodb-user-repository'

export const usersRepositoryProvider = {
  provide: 'USER_REPOSITORY',
  useClass: MongoDbUserRepository,
}
