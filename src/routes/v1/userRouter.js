import { Router } from 'express'
import UserController from '../../controllers/v1/userController.js'
import authorization from '../../middlewares/authorization.js'
import authentication from '../../middlewares/authentication.js'

const userRouter = new Router()
const account = new UserController()

// Post Methods
userRouter.post('/', account.create.bind(account))
userRouter.post('/login', account.login.bind(account))
userRouter.post('/reset', account.reset.bind(account))

userRouter.use(authorization)

// Get Methods
userRouter.get('/', authentication, account.get.bind(account))

// Patch Methods
userRouter.patch('/', authentication, account.update.bind(account))

export default userRouter
