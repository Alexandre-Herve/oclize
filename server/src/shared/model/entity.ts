import { validate, IsNotEmpty } from 'class-validator'

export class Entity {
  @IsNotEmpty()
  public id: string

  constructor() {
    this.id = ''
  }

  public validate = () => validate(this)

  public isValid = async () => {
    const errors = await this.validate()
    return errors.length === 0
  }
}
