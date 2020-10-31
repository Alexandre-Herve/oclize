import { prop } from '@typegoose/typegoose';

const emailRegex = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export class User {
  @prop({
    unique: true,
    required: true,
    index: true,
    // TODO: use class-validator?
    match: emailRegex,
  })
  email!: string;

  @prop()
  name?: string;

  // TODO: cipher password
  @prop()
  password?: string;
}
