export interface Weapon {
    _id: number,
    name: string,
    stock: boolean,
    item_name: string,
    item_slot: ItemSlot,
    image_url: string,
    image_url_large: string,
    used_by_classes?: Merc[],  // if not present, everyone can use it
    per_class_loadout_slots?: Partial<Record<Merc, string>>  // if not present, each merc uses this weapon in the slot given by item_slot
}

export enum ItemSlot {
    primary = "primary",
    secondary = "secondary",
    melee = "melee"
}

export enum Merc {
    Scout = "Scout",
    Soldier = "Soldier",
    Pyro = "Pyro",
    Demoman = "Demoman",
    Heavy = "Heavy",
    Engineer = "Engineer",
    Medic = "Medic",
    Sniper = "Sniper",
    Spy = "Spy"
}

// TODO: test this extensively
export const isValidWeapon = (weapon: Weapon, merc: Merc, slot: ItemSlot): boolean => {
    if (weapon.per_class_loadout_slots) {
        return weapon.per_class_loadout_slots?.[merc] === slot
    }

    const isCorrectSlot = weapon.item_slot === slot
    const isClassUsable = !weapon.used_by_classes || weapon.used_by_classes.includes(merc)

    return isCorrectSlot && isClassUsable
}

