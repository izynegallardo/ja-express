import jwt from 'jsonwebtoken'

export function generateToken(payload, options = {}) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d',
        ...options,
    })
}
