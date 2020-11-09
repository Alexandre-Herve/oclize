import { IsString, IsDate, IsNotEmpty, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateSessionDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  readonly name?: string

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  readonly startTime?: Date
}
