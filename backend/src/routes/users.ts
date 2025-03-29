import { Router } from 'express'
import { jwtCheck } from '../accessControl'
import { getUsers } from '../controllers/users'

const router = Router()
    .get('/', jwtCheck, getUsers)

export default router