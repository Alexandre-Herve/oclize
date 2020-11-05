import { User } from '../model/user'
import { CreateUserDto } from './create-user.dto'
import { Option } from 'fp-ts/lib/Option'

export interface UserRepository {
  create(user: CreateUserDto): Promise<string>
  getByEmail(email: string): Promise<Option<User>>
}
