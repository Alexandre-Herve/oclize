import { Injectable, Inject } from '@nestjs/common'
import { SessionRepository } from '../../domain/ports/session-repository'
import { SessionProps } from '../../domain/model/session'
import { Db } from 'mongodb'
import { MONGODB_CONNECTION } from '../../../shared/infrastructure/constants'

@Injectable()
export class MongoDbSessionRepository implements SessionRepository {
  constructor(
    @Inject(MONGODB_CONNECTION)
    private db: Db,
  ) {}

  public async create(id: string, sessionProps: SessionProps) {
    const doc = { _id: id, ...sessionProps }
    await this.db.collection('sessions').insertOne(doc)
  }
}
