import { MongoDbIdService } from '../adapters/mongodb/mongodb-id.service'
import { ID_SERVICE } from '../domain/ports/constants'

export const idServiceProvider = {
  provide: ID_SERVICE,
  useClass: MongoDbIdService,
}
