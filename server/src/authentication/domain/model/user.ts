import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidationError,
  validateSync,
} from 'class-validator'
import { Entity } from '../../../shared/model/entity'
import { left, right, Either } from 'fp-ts/lib/Either'

class UserProps {
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string

  static create(params: UserProps) {
    const props = new UserProps()
    Object.assign(props, params)
    return props
  }
}

export class User extends Entity<UserProps> {
  private constructor(id: string, props: UserProps) {
    super(id, props)
  }

  public static create(
    id: string,
    params: UserProps,
  ): Either<ValidationError[], User> {
    const userProps = UserProps.create(params)
    const errors = validateSync(userProps)
    if (errors.length > 0) {
      return left(errors)
    }
    const user = new User(id, userProps)
    return right(user)
  }
}
