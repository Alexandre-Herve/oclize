import { Injectable, Inject } from '@nestjs/common'
import { UserRepository } from '../../domain/ports/user-repository'
import { CreateUserDto } from '../../domain/ports/create-user.dto'
import { User } from '../../domain/model/user'
import { Db } from 'mongodb'
import { Option, fromEither, none } from 'fp-ts/lib/Option'

const isMongoObject = (x: unknown) =>
  typeof x === 'object' && x !== null && '_id' in x

@Injectable()
export class MongoDbUserRepository implements UserRepository {
  constructor(
    @Inject('MONGODB_CONNECTION')
    private db: Db,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const res = await this.db.collection('users').insertOne(createUserDto)
    return res.insertedId
  }

  public async getByEmail(email: string): Promise<Option<User>> {
    const res = await this.db.collection('users').findOne({ email })
    if (!isMongoObject(res)) {
      return none
    }
    const user = User.create(res._id, {
      email: res.email,
      password: res.password,
    })
    return fromEither(user)
  }
}
