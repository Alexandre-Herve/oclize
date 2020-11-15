import { IsEmail } from 'class-validator'

export class RequestUniqueTokenDto {
  @IsEmail()
  email!: string
}
