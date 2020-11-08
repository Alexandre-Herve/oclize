import { ValueObject } from './value-object'
import { IsNotEmpty, IsString } from 'class-validator'

export abstract class EntityProps extends ValueObject {
  @IsString()
  @IsNotEmpty()
  id!: string
}
