import validator from 'validator'
import { connection } from '../core/database.js'
import { encrypt } from '../utils/hash.js'

class User {
    constructor() {
        this.pool = connection
    }

    async get(identifier) {
        try {
            const queryField = validator.isEmail(identifier) ? 'email' : 'username'
            const [results] = await this.pool.execute(
                `SELECT userId, fullname, username, email, created_at, updated_at FROM User WHERE ${queryField}=?`,
                [identifier],
            )
            return results?.[0]
        } catch (error) {
            console.error('<error> user.get', error)
            throw error
        }
    }

    async create(email, username, fullname, password) {
        try {
            const [results] = await this.pool.execute(
                'INSERT INTO User (fullname, username, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
                [fullname, username, email, await encrypt(password)],
            )

            return results
        } catch (error) {
            console.error('<error> user.create', error)
            throw error
        }
    }

    async verify(identifier, password) {
        try {
            const queryField = validator.isEmail(identifier) ? 'email' : 'username'

            const [results] = await this.pool.execute(
                `SELECT * FROM User WHERE ${queryField}=? AND password=?`,
                [identifier, await encrypt(password)],
            )
            return results?.[0]
        } catch (error) {
            console.error('<error> user.verify', error)
            throw error
        }
    }

    async update(userId, fullname, email, username) {
        try {
            const [results] = await this.pool.execute(
                'UPDATE User SET fullname=?, email=?, username=?, updated_at=NOW() WHERE userId=?',
                [fullname, email, username, userId],
            )
            return results
        } catch (error) {
            console.error('<error> user.update', error)
            throw error
        }
    }
}

export default User
