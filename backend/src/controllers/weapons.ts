import { Request, Response } from 'express'
import { getWeaponsCollection } from '../database'
import { Weapon } from '../models/weapon'
import { AppError, handleErrors } from '../errors'

export const getWeapons = async (req: Request, res: Response) => {
    try {
        const weaponsCollection = getWeaponsCollection()

        const filter: any = {}
        const { merc, slot } = req.query

        if (merc && slot) {
            filter.$and = [
                {
                    $or: [
                        { used_by_classes: merc, item_slot: slot },
                        { [`per_class_loadout_slots.${merc}`]: slot },
                        { used_by_classes: { $exists: false }, item_slot: slot }
                    ]
                },
                {  // a way of saying "if `per_class_loadout_slots` DOES exist, then ensure merc,slot are correct there"
                    $or: [
                        { [`per_class_loadout_slots.${merc}`]: { $exists: false } },  
                        { [`per_class_loadout_slots.${merc}`]: slot }
                    ]
                }
            ]
        } else {
            if (merc) {
                filter.$or = [
                    { used_by_classes: merc },
                    { [`per_class_loadout_slots.${merc}`]: { $exists: true } },
                    { used_by_classes: { $exists: false } }
                ]
            }
            if (slot) {
                filter.item_slot = slot;
            }
        }

        const weapons = await weaponsCollection.find(filter).sort({ stock: -1 }).toArray()
        res.status(200).json(weapons)
    } catch (error) {
        handleErrors(error as Error, res)
    }
}

export const getWeaponById = async (req: Request, res: Response) => {
    try {
        const weaponsCollection = getWeaponsCollection()
        const weaponId = parseInt(req.params.id, 10)
        const weapon = await weaponsCollection.findOne({ _id: weaponId })

        if (!weapon) {
            throw new AppError(404, 'Weapon not found')
        }

        res.json(weapon)
    } catch (error) {
        handleErrors(error as Error, res)
    }
}

/**
 * Helper function for getting multiple weapons in 1 go
 */
export const getMultipleWeapons = async (weaponIds: number[]): Promise<Weapon[]> => {
    const weaponsCollection = getWeaponsCollection()
    return await weaponsCollection.find({ _id: { $in: weaponIds } }).toArray()
};



export interface WeaponSetFetchResult {
    primary: Weapon | null
    secondary: Weapon | null
    melee: Weapon | null
}

// TODO: figure out a better way to write this
/**
 * Helper for getting a primary+secondary+melee weapon set
 */
export const fetchWeaponSet = async (primaryId: number, secondaryId: number, meleeId: number): Promise<WeaponSetFetchResult> => {
    return fetchPartialWeaponSet(primaryId, secondaryId, meleeId)
}

/**
 * Helper for getting an optional primary+secondary+melee weapon set
 */
export const fetchPartialWeaponSet = async (primaryId?: number, secondaryId?: number, meleeId?: number): Promise<WeaponSetFetchResult> => {
    const weaponsCollection = getWeaponsCollection()

    const weaponIds = [primaryId, secondaryId, meleeId].filter((id): id is number => id !== undefined)

    const weapons = await weaponsCollection.find({ _id: { $in: weaponIds } }).toArray()

    const result: WeaponSetFetchResult = {
        primary: null,
        secondary: null,
        melee: null,
    }

    weapons.forEach((weapon) => {
        if (weapon._id === primaryId) {
            result.primary = weapon;
        } else if (weapon._id === secondaryId) {
            result.secondary = weapon;
        } else if (weapon._id === meleeId) {
            result.melee = weapon;
        }
    })

    return result
}