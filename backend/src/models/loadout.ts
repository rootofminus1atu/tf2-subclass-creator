import { ObjectId } from "mongodb"
import { isValidWeapon, ItemSlot, Merc, Weapon } from "./weapon"
import Joi from "joi"
import { fetchPartialWeaponSet, fetchWeaponSet } from "../controllers/weapons"

export interface Loadout {
    _id?: ObjectId
    userId?: string
    merc: Merc
    primary: number
    secondary: number
    melee: number
    name: string
    playstyle: string
    createdAt?: Date
    updatedAt?: Date

    favorites?: string[]
    isFavorited?: boolean
}

export interface FullLoadout extends Omit<Loadout, keyof typeof ItemSlot> {
    primary: Weapon
    secondary: Weapon
    melee: Weapon
}

// TODO: maybe just throw exceptions instead of returning monadic errors like joi does but whatever

export const validateLoadout = async (loadout: Loadout): Promise<{ error?: Joi.ValidationError | string, value?: Loadout }> => {
    const loadoutSchema = Joi.object<Loadout>({
        merc: Joi.string().valid(...Object.values(Merc)).required(),
        primary: Joi.number().required(),
        secondary: Joi.number().required(),
        melee: Joi.number().required(),
        name: Joi.string().min(3).required(),
        playstyle: Joi.string().min(3).required()
    })

    const { error } = loadoutSchema.validate(loadout)
    if (error) {
        return { error }
    }

    const { primary, secondary, melee } = await fetchWeaponSet(loadout.primary, loadout.secondary, loadout.melee);

    if (!primary || !isValidWeapon(primary, loadout.merc, ItemSlot.primary)) {
        return { error: 'Invalid primary weapon' }
    }
    if (!secondary || !isValidWeapon(secondary, loadout.merc, ItemSlot.secondary)) {
        return { error: 'Invalid secondary weapon' }
    }
    if (!melee || !isValidWeapon(melee, loadout.merc, ItemSlot.melee)) {
        return { error: 'Invalid melee weapon' }
    }

    return { value: loadout }
}

export const validateLoadoutForUpdate = async (loadout: Partial<Loadout>): Promise<{ error?: Joi.ValidationError | string, value?: Partial<Loadout> }> => {
    const loadoutUpdateSchema = Joi.object<Partial<Loadout>>({
        merc: Joi.string().valid(...Object.values(Merc)).required(),
        primary: Joi.number().optional(),
        secondary: Joi.number().optional(),
        melee: Joi.number().optional(),
        name: Joi.string().min(3).optional(),
        playstyle: Joi.string().min(3).optional()
    })

    const { error } = loadoutUpdateSchema.validate(loadout)
    if (error) {
        return { error }
    }

    const { primary, secondary, melee } = await fetchPartialWeaponSet(loadout.primary, loadout.secondary, loadout.melee)

    const mercToValidate = loadout.merc as Merc  // because merc is required from the joi schema above

    if (loadout.primary !== undefined && (!primary || !isValidWeapon(primary, mercToValidate, ItemSlot.primary))) {
        return { error: 'Invalid primary weapon' }
    }

    if (loadout.secondary !== undefined && (!secondary || !isValidWeapon(secondary, mercToValidate, ItemSlot.secondary))) {
        return { error: 'Invalid secondary weapon' }
    }

    if (loadout.melee !== undefined && (!melee || !isValidWeapon(melee, mercToValidate, ItemSlot.melee))) {
        return { error: 'Invalid melee weapon' }
    }

    return { value: loadout }
}