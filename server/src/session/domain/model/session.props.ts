import { IsDate, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

import { EntityProps } from '../../../shared/model/entity-props'
import { Invitee } from './invitee'

export class SessionProps extends EntityProps {
  @IsNotEmpty()
  @IsString()
  readonly createdBy!: string

  @IsDate()
  readonly createdAt!: Date

  @IsNotEmpty()
  @IsString()
  readonly name!: string

  @ValidateNested()
  readonly invitees!: Invitee[]

  @IsDate()
  readonly startTime!: Date
}
