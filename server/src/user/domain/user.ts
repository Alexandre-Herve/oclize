import { prop } from '@typegoose/typegoose';

export class User {
    @prop()
    name?: string;
}
