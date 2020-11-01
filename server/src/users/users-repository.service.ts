import { Injectable } from '@nestjs/common'
import { User } from './model/user'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'

@Injectable()
export class UsersRepositoryService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async create(user: User) {
    const createdUser = new this.userModel(user)
    return await createdUser.save()
  }

  async list(): Promise<User[] | null> {
    return await this.userModel.find().lean()
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).lean()
  }
}
