import { MongoDbIdService } from '../adapters/mongodb/mongodb-id.service'

export const idServiceProvider = {
  provide: 'ID_SERVICE',
  useClass: MongoDbIdService,
}
