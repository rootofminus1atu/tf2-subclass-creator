import { Router } from 'express'
import { createLoadout, getLoadouts, getLoadoutById, updateLoadout, deleteLoadout } from '../controllers/loadouts'
import { jwtCheck } from '../accessControl'

const router = Router()
    .get('/', getLoadouts)
    .get('/:id', getLoadoutById)
    .post('/', jwtCheck, createLoadout)
    .put('/:id', jwtCheck, updateLoadout)
    .delete('/:id', jwtCheck, deleteLoadout)

export default router