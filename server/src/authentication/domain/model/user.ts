import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { Entity } from '../../../shared/model/entity'

interface CreateParams {
  email: string
  password?: string
}

export class User extends Entity {
  @IsNotEmpty()
  @IsEmail()
  email!: string

  @IsString()
  password?: string

  constructor(params: CreateParams) {
    super()
    Object.assign(this, params)
  }
}
