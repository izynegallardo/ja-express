import { expect, jest } from '@jest/globals'
import { toBoolean } from 'validator'

const mockCreate = jest.fn()
const mockVerify = jest.fn()

jest.unstable_mockModule('../../../models/user.js', () => ({
    default: jest.fn().mockImplementation(() => ({
        create: mockCreate,
        get: jest.fn(),
        verify: mockVerify,
        update: jest.fn(),
    })),
}))

const { default: request } = await import('supertest')
const { default: app } = await import('../../../app.js')

describe('POST /api/v1/users (mocked model)', () => {
    beforeEach(() => {
        mockCreate.mockReset()
        mockVerify.mockReset()
    })

    it('creates a user and returns a token', async () => {
        mockCreate.mockResolvedValue({ insertId: 1 })

        const response = await request(app).post('/api/v1/users').send({
            email: 'test@example.com',
            username: 'testuser',
            fullname: 'Test User',
            password: 'secret123',
            verifyPassword: 'secret123',
        })

        expect(response.statusCode).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.data.userId).toBe(1)
    })

    it('rejects mismatched passwords without touching the model', async () => {
        const response = await request(app).post('/api/v1/users').send({
            email: 'test@example.com',
            password: 'secret123',
            verifyPassword: 'nope',
        })

        expect(response.statusCode).toBe(400)
        expect(mockCreate).not.toHaveBeenCalled()
    })

    it('accepts correct identifier and password without touching the model', async () => {
        mockVerify.mockResolvedValue({ userId: 1, email: 'test@example.com', username: 'testuser' })

        const response = await request(app).post('/api/v1/users/login').send({
            identifier: 'test@example.com',
            password: 'secret123',
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.token).toBeDefined()
    })
})
