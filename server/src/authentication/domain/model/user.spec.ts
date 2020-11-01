import { User } from './user'

describe('User', () => {
  const email = 'email@test.com'
  const password = 'password'

  describe('new', () => {
    it('should return a valid user', async () => {
      const user = new User({ email, password })
      expect(user.email).toBe(email)
      expect(user.password).toBe(password)

      const valid = await user.isValid()
      expect(valid).toBe(true)
    })

    it('should throw for an invalid email', async () => {
      const invalidEmail = 'invalid'
      const user = new User({ email: invalidEmail, password })

      const valid = await user.isValid()
      expect(valid).toBe(false)
    })
  })
})
