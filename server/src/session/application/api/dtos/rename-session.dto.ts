import { IsString, IsNotEmpty } from 'class-validator'

export class RenameSessionDto {
  @IsNotEmpty()
  @IsString()
  readonly name!: string
}
