import { ValidationError } from 'class-validator'

export interface InvalidReason {
  property?: string
  message: string
  children?: InvalidReason[]
}

export const validateErrorToReason = (
  error: ValidationError,
): InvalidReason => {
  const constraints = Object.values(error.constraints || {})
  return {
    property: error.property,
    message: constraints[0],
    children: error.children.map(validateErrorToReason),
  }
}
