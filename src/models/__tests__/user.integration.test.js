import { connection } from '../../core/database.js'
import User from '../user.js'

describe('User model (integration)', () => {
    const user = new User()
    const testEmail = `test_${Date.now()}@example.com`
    const testUsername = `testuser_${Date.now()}`

    afterAll(async () => {
        await connection.execute('DELETE FROM User WHERE email = ?', [testEmail])
        await connection.end()
    })

    it('creates a user and retrieves it by email', async () => {
        await user.create(testEmail, testUsername, 'Test User', 'password123')

        const found = await user.get(testEmail)

        expect(found.email).toBe(testEmail)
        expect(found.username).toBe(testUsername)
    })
})
