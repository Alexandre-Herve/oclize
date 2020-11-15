import { User } from '../model/user'
import { CreateUserDto } from './create-user.dto'
import { UserProps } from '../model/user'
import { Option } from 'fp-ts/lib/Option'

export type Update<T> = Partial<Exclude<T, 'id'>>

export interface UserRepository {
  create(user: CreateUserDto): Promise<string>
  getByEmail(email: string): Promise<Option<User>>
  update(userId: string, props: Update<UserProps>): Promise<void>
}
