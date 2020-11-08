import { User } from './user'
import { isLeft, isRight } from 'fp-ts/lib/Either'

describe('User', () => {
  const email = 'email@test.com'
  const password = 'password'
  const id = 'id'

  describe('new', () => {
    it('should return a valid user', async () => {
      const userResult = await User.create({ id, email, password })
      if (!isRight(userResult)) {
        throw new Error('user should have been valid')
      }
      const user = userResult.right
      expect(user.props.email).toBe(email)
      expect(user.props.password).toBe(password)
      expect(user.id).toBe(id)
    })

    it('should accept an undefined password', async () => {
      const userResult = await User.create({ id, email })
      if (!isRight(userResult)) {
        throw new Error('user should have been valid')
      }
      const user = userResult.right
      expect(user.props.email).toBe(email)
      expect(user.props.password).toBe(undefined)
      expect(user.id).toBe(id)
    })

    it('should return errors for an invalid email', async () => {
      const invalidEmail = 'invalid'
      const userResult = await User.create({
        id,
        email: invalidEmail,
        password,
      })
      if (!isLeft(userResult)) {
        throw new Error('user should not have been valid')
      }
      expect(userResult.left.length).toBeGreaterThan(0)
    })

    it('should return errors for an invalid password', async () => {
      const invalidPassword = 'ha'
      const userResult = await User.create({
        id,
        email,
        password: invalidPassword,
      })
      if (!isLeft(userResult)) {
        throw new Error('user should not have been valid')
      }
      expect(userResult.left.length).toBeGreaterThan(0)
    })
  })
})
