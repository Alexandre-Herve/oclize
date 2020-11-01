import { User } from '../model/user'
import { CreateUserDto } from './create-user.dto'

export interface UserRepository {
  create(user: CreateUserDto): Promise<string>
  getByEmail(email: string): Promise<User | null>
}
