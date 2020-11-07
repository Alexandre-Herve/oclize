import { IsEmail, IsString, IsNotEmpty } from 'class-validator'

export class InviteToSessionDto {
  @IsNotEmpty()
  @IsString()
  readonly sessionId!: string

  @IsNotEmpty()
  @IsEmail()
  readonly email!: string
}
