import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
  ValidationError,
  validate,
} from 'class-validator'
import { Entity } from '../../../shared/model/entity'
import { EntityProps } from '../../../shared/model/entity-props'
import { UniqueToken } from './unique-token'
import { left, right, Either } from 'fp-ts/lib/Either'
import {
  InvalidReason,
  validateErrorToReason,
} from '../../../shared/model/errors'
import { UserUpdate } from './user.update'

export class UserProps extends EntityProps {
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string

  @ValidateNested()
  uniqueToken?: UniqueToken
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

  public async update(
    userUpdate: UserUpdate,
  ): Promise<Either<InvalidReason[], User>> {
    const newProps = { ...this.props, ...userUpdate }
    const userProps = UserProps.create<UserProps>(newProps)
    const errors = await validate(userProps)
    if (errors.length > 0) {
      return left(errors.map(validateErrorToReason))
    }
    this.props = userProps
    return right(this)
  }
}
