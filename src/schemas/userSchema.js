import { z } from 'zod'

export const createUserSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(100),
    fullname: z.string().min(1).max(255),
    password: z.string().min(8),
    verifyPassword: z.string().min(8),
})

export const loginSchema = z.object({
    identifier: z.string().min(1),
    password: z.string().min(8),
})

export const updateUserSchema = z.object({
    fullname: z.string().min(1).max(255).optional(),
    email: z.string().email().optional(),
})

export const resetSchema = z.object({
    identifier: z.string().min(1),
})
