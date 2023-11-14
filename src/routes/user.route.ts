import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import container from '../config/inversify.config'
import { IUserService } from '../services/interfaces/user.service.interface'

const userService = container.get<IUserService>('IUserService')

const userController = new UserController(userService)

const router = Router()

router.get('/', userController.getUsers)
router.delete('/:id', userController.deleteUser)
router.put('/:id', userController.updateUser)

export default router
