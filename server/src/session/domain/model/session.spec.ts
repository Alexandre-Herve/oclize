import { Session } from './session'
import { Invitee, InviteeStatus } from './invitee'
import { isLeft, isRight } from 'fp-ts/lib/Either'

describe('Session', () => {
  const id = 'id'
  const invitee = Invitee.create({
    email: 'invitee@test.com',
    status: InviteeStatus.Invited,
  })
  const invitees = [invitee]
  const createdBy = 'userId'
  const createdAt = new Date()
  const name = 'session name'
  const startTime = new Date()
  const params = {
    createdAt,
    createdBy,
    id,
    invitees,
    name,
    startTime,
  }

  describe('new', () => {
    it('should return a valid session', async () => {
      const sessionResult = await Session.create(params)
      if (!isRight(sessionResult)) {
        throw new Error(`session creation failed with ${sessionResult.left}`)
      }
      const session = sessionResult.right
      expect(session.id).toBe(id)
      expect(session.props.name).toBe(name)
      expect(session.props.createdAt).toBe(createdAt)
      expect(session.props.createdBy).toBe(createdBy)
      expect(session.props.invitees).toEqual(invitees)
    })

    it('should return errors for an invalid invitee', async () => {
      const invitees = [
        Invitee.create({
          email: 'invalidEmail',
          status: InviteeStatus.Invited,
        }),
      ]
      const sessionResult = await Session.create({ ...params, invitees })
      if (!isLeft(sessionResult)) {
        throw new Error(`session should not have been valid`)
      }
      expect(sessionResult.left.length).toBeGreaterThan(0)
    })
  })

  describe('rename', () => {
    describe('with a valid name', () => {
      it('should return true and have changed the name', async () => {
        const sessionResult = await Session.create(params)
        if (!isRight(sessionResult)) {
          throw new Error(`session creation failed with ${sessionResult.left}`)
        }
        const session = sessionResult.right
        const newName = 'newname'
        const res = await session.rename(newName)
        expect(res).toBe(true)
        expect(session.props.name).toBe(newName)
      })
    })
    describe('with an invalid name', () => {
      it('should return false and have kept the name', async () => {
        const sessionResult = await Session.create(params)
        if (!isRight(sessionResult)) {
          throw new Error(`session creation failed with ${sessionResult.left}`)
        }
        const session = sessionResult.right
        const newName = ''
        const res = await session.rename(newName)
        expect(res).toBe(false)
        expect(session.props.name).toBe(name)
      })
    })
  })
})
