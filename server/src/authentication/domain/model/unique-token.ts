import { ValueObject } from '../../../shared/model/value-object'
import { IsDate, IsNotEmpty, IsString } from 'class-validator'

export class UniqueToken extends ValueObject {
  @IsString()
  @IsNotEmpty()
  id!: string

  @IsDate()
  createdAt!: Date
}
