import { IsDate, IsNotEmpty, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  readonly name!: string

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly startTime!: Date
}
