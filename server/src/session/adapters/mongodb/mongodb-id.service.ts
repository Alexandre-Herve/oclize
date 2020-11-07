import { IdService } from '../../domain/ports/id.service'
import { ObjectId } from 'mongodb'

export class MongoDbIdService implements IdService {
  newId() {
    // TODO check
    return new ObjectId().toHexString()
  }
}
