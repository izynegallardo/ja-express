import { connection } from '../core/database.js'
import { encrypt } from '../utils/hash.js'
import validator from 'validator'

class Otp {
    constructor() {
        this.pool = connection
    }

    async create(otp, email, purpose) {
        try {
            const hashedOTP = await encrypt(otp)
            const expires_at = new Date(Date.now() + 10 * 60 * 1000)

            const [results] = await this.pool.execute(
                `
                    INSERT INTO Otp (otp, destination, purpose, attempts, verified, created_at, expires_at) 
                    VALUES (?, ?, ?, 0, FALSE, NOW(), ?) 
                    ON DUPLICATE KEY UPDATE otp = ?, purpose = ?, attempts = 0, verified = FALSE, created_at = NOW(), expires_at = ?
                `,
                [hashedOTP, email, purpose, expires_at, hashedOTP, purpose, expires_at],
            )

            return {
                results,
                expires_at,
                destination: email,
                purpose,
            }
        } catch (error) {
            console.error('<error> otp.create', error)
            throw error
        }
    }

    async verify(identifier, password) {
        try {
            const queryField = validator.isEmail(identifier) ? 'email' : 'username'

            const [results] = await this.pool.execute(
                `SELECT * FROM Users WHERE ${queryField}=? AND password=?`,
                [identifier, encryptPassword(password)],
            )
            return results?.[0]
        } catch (error) {
            console.error('<error> otp.verify', error)
            throw error
        }
    }

    async get(email) {
        try {
            const [results] = await this.pool.execute(`SELECT * FROM Otp WHERE destination=?`, [
                email,
            ])
            return results?.[0]
        } catch (error) {
            console.error('<error> otp.get', error)
            throw error
        }
    }
}

export default Otp
