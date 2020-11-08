import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidationError,
  validate,
} from 'class-validator'
import { Entity } from '../../../shared/model/entity'
import { EntityProps } from '../../../shared/model/entity-props'
import { left, right, Either } from 'fp-ts/lib/Either'

class UserProps extends EntityProps {
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string
}

export class User extends Entity<UserProps> {
  public static async create(
    params: UserProps,
  ): Promise<Either<ValidationError[], User>> {
    const userProps = UserProps.create<UserProps>(params)
    const errors = await validate(userProps)
    if (errors.length > 0) {
      return left(errors)
    }
    const user = new User(userProps)
    return right(user)
  }
}
