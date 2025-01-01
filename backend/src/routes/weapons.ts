import { Router } from "express"
import { getWeaponById, getWeapons } from "../controllers/weapons"

const router = Router()
    .get('/', getWeapons)
    .get('/:id', getWeaponById)


export default router