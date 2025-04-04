import { ItemSlot, Merc, Weapon } from "./weapon";

export interface Loadout {
    _id: string,
    userId: string,
    isFavorited: boolean,
    merc: Merc,
    primary: number,
    secondary: number,
    melee: number,
    name: string,
    playstyle: string,
    createdAt?: string,
    updatedAt?: string
}

type NonSettableFields = '_id' | 'userId' | 'isFavorited'

export interface LoadoutForCreate extends Omit<Loadout, NonSettableFields> {}

export function toLoadoutForUpdate(loadout: LoadoutForCreate) {
    return loadout as LoadoutForUpdate
}

export interface LoadoutForUpdate extends Partial<LoadoutForCreate> {}

export interface FullLoadout extends Omit<Loadout, keyof typeof ItemSlot> {
    primary: Weapon
    secondary: Weapon
    melee: Weapon
    // createdAt: string
    // updatedAt: string
}

export interface FullLoadoutForCreate extends Omit<FullLoadout, NonSettableFields> {}

export function toShallowLoadout(loadout: FullLoadoutForCreate): LoadoutForCreate {
    return {
        ...loadout,
        primary: loadout.primary._id,
        secondary: loadout.secondary._id,
        melee: loadout.melee._id
    }
}

export interface FullLoadoutForUpdate extends Partial<FullLoadoutForCreate> {}
