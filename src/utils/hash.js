import crypto from 'crypto'

export function encrypt(value) {
    return crypto.createHmac('sha256', process.env.API_SECRET).update(value).digest('hex')
}
