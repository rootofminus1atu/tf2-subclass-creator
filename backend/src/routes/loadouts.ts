import { Router } from 'express'
import { createLoadout, getLoadouts, getLoadoutById, updateLoadout, deleteLoadout } from '../controllers/loadouts'
import { jwtCheck, optionalAuth } from '../accessControl'

const router = Router()
    .get('/', optionalAuth, getLoadouts)
    .get('/:id', optionalAuth, getLoadoutById)
    .post('/', jwtCheck, createLoadout)
    .put('/:id', jwtCheck, updateLoadout)
    .delete('/:id', jwtCheck, deleteLoadout)

export default router