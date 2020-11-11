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
  startTime.setDate(startTime.getDate() + 1)

  const params = {
    createdAt,
    createdBy,
    id,
    invitees,
    name,
    startTime,
  }

  describe('new', () => {
    describe('with a valid session', () => {
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
    })
    describe('with an invalid invitee', () => {
      it('should return errors', async () => {
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
    describe('with a past startTime', () => {
      it('should return errors', async () => {
        const invalidStartTime = new Date()
        invalidStartTime.setDate(invalidStartTime.getDate() - 1)
        const sessionResult = await Session.create({
          ...params,
          startTime: invalidStartTime,
        })
        if (!isLeft(sessionResult)) {
          throw new Error(`session should not have been valid`)
        }
      })
    })
  })

  describe('update', () => {
    describe('with valid parameters', () => {
      it('should return true and have updatd the params', async () => {
        const sessionResult = await Session.create(params)
        if (!isRight(sessionResult)) {
          throw new Error(`session creation failed with ${sessionResult.left}`)
        }
        const session = sessionResult.right
        const newName = 'newname'
        const newStartTime = new Date()
        newStartTime.setDate(newStartTime.getDate() + 3)
        const res = await session.update({
          name: newName,
          startTime: newStartTime,
        })
        expect(res).toBe(true)
        expect(session.props.name).toBe(newName)
        expect(session.props.startTime).toBe(newStartTime)
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
        const res = await session.update({ name: newName })
        expect(res).toBe(false)
        expect(session.props.name).toBe(name)
      })
    })
    describe('with a past startTime', () => {
      it('should return false and have kept the name', async () => {
        const sessionResult = await Session.create(params)
        if (!isRight(sessionResult)) {
          throw new Error(`session creation failed with ${sessionResult.left}`)
        }
        const session = sessionResult.right
        const newStartTime = new Date()
        newStartTime.setDate(newStartTime.getDate() - 1)
        const res = await session.update({ startTime: newStartTime })
        expect(res).toBe(false)
        expect(session.props.startTime).toBe(startTime)
      })
    })
    describe('when the session has already started', () => {
      it('should refuse to change starTime', async (done) => {
        const startTime = new Date()
        startTime.setMilliseconds(startTime.getMilliseconds() + 100)

        const sessionResult = await Session.create({ ...params, startTime })
        if (!isRight(sessionResult)) {
          throw new Error(`session creation failed with ${sessionResult.left}`)
        }
        const session = sessionResult.right
        setTimeout(async () => {
          const newStartTime = new Date()
          newStartTime.setDate(newStartTime.getDate() + 3)
          const res = await session.update({ startTime: newStartTime })

          expect(res).toBe(false)
          expect(session.props.startTime).toBe(startTime)
          done()
        }, 150)
      })
    })
  })
})
