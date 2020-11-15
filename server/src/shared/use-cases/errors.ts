import { InvalidReason } from '../model/errors'

export type NotFound = {
  type: 'not_found'
}

export type Forbidden = {
  type: 'forbidden'
}

export type Invalid = {
  type: 'invalid'
  reasons: InvalidReason[]
}

export const notFound: NotFound = { type: 'not_found' }
