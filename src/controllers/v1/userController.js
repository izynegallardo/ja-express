import User from '../../models/user.js'
import Otp from '../../models/otp.js'
import { generateToken } from '../../utils/jwt.js'
import { generateOTP } from '../../utils/random.js'
import { generatePasswordResetEmailHTML } from '../../templates/passwordReset.js'
import sendMail from '../../services/nodemailer.js'

class UserController {
    constructor() {
        this.user = new User()
        this.otp = new Otp()
    }

    async create(request, response) {
        try {
            const { email, username, fullname, password, verifyPassword } = request.body || {}

            if (password != verifyPassword) {
                return response.status(400).json({
                    success: false,
                    message: "Password doesn't match.",
                })
            }

            const result = await this.user.create(email, username, fullname, password)

            const token = generateToken({
                email: email,
                username: username,
                role: 'user',
            })

            response.status(201).json({
                success: true,
                data: {
                    userId: result?.insertId,
                    token: token,
                },
            })
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return response.status(409).json({
                    success: false,
                    message: 'An account with this email already exists.',
                })
            }

            response.status(500).json({
                success: false,
                message: error.toString(),
            })
        }
    }

    async login(request, response) {
        try {
            const { identifier, password } = request.body || {}

            const user = await this.user.verify(identifier, password)

            if (!user || !user.userId) {
                return response.status(400).json({
                    success: false,
                    message: 'Invalid email or password!',
                })
            }

            const token = generateToken({
                email: user.email,
                username: user.username,
            })

            response.status(200).json({
                success: true,
                data: {
                    token: token,
                },
            })
        } catch (error) {
            response.status(500).json({
                success: false,
                message: error.toString(),
            })
        }
    }

    async get(request, response) {
        try {
            const userDetails = await this.user.get(
                response.locals.email || response.locals.username,
            )

            response.status(200).json({
                success: true,
                data: {
                    ...userDetails,
                },
            })
        } catch (error) {
            response.status(500).json({
                success: false,
                message: error.toString(),
            })
        }
    }

    async update(request, response) {
        try {
            const { fullname, email } = request.body || {}

            const currentData = await this.user.get(response.locals.email)

            const upFullname = fullname ?? currentData.fullname
            const upEmail = email ?? currentData.email
            const upUsername = email ?? currentData.username

            const result = await this.user.update(
                currentData.userId,
                upFullname,
                upEmail,
                upUsername,
            )

            const token = generateToken({
                email: upEmail,
                username: upUsername,
            })

            if (result?.affectedRows > 0) {
                return response.status(200).json({
                    success: true,
                    message: 'Profile updated successfully',
                    data: token,
                })
            }

            return response.status(409).json({
                success: false,
                message: 'No changes were made',
            })
        } catch (error) {
            return response.status(500).json({
                success: false,
                message: error.toString(),
            })
        }
    }

    async reset(request, response) {
        try {
            const { identifier } = request.body || {}

            const user = await this.user.get(identifier)

            const message = 'If this email exists, a password reset link has been sent.'

            if (!user) {
                return response.status(200).json({
                    success: true,
                    message: message,
                })
            }

            const plainOTP = await generateOTP()
            const purpose = `password_reset`
            const otp = await this.otp.create(plainOTP, user.email, purpose)

            const sender_name = `Express App`
            const resetLink = `https://${process.env.API_HOST}:${process.env.API_PORT}/api/v1/account/reset-password?email=${encodeURIComponent(user.email)}`
            const minutes = Math.ceil((otp.expires_at.getTime() - Date.now()) / 60000)
            const emailHTML = await generatePasswordResetEmailHTML(
                user.fullname,
                sender_name,
                plainOTP,
                resetLink,
                minutes,
            )

            const emailResult = null

            if (process.env.ENV === 'production') {
                emailResult = await sendMail(
                    `${sender_name} Support`,
                    process.env.GOOGLE_USER,
                    user.email,
                    'Password Reset Request',
                    `Your OTP is: ${plainOTP}`,
                    emailHTML,
                )
            }

            return response.status(200).json({
                success: true,
                message: message,
                data: process.env.ENV === 'production' ? emailResult : plainOTP,
            })
        } catch (error) {
            return response.status(500).json({
                success: false,
                message: error.toString(),
            })
        }
    }
}

export default UserController
