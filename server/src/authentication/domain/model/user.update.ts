import { UserProps } from './user'

export type UserUpdate = Partial<Pick<UserProps, 'password' | 'uniqueToken'>>
