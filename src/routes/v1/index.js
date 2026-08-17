import { Router } from 'express'

import homeRouter from './homeRouter.js'
import userRouter from './userRouter.js'

const v1 = new Router()

v1.use('/', homeRouter)
v1.use('/users', userRouter)

export default v1
