import fs from 'fs'
import path from 'path'
import { Item } from './save_weapons'
import { ItemSlot, Merc, Weapon } from '../models/weapon'

// IMPORTANT NOTE:
// if revisiting in the future remember to also allos `pda2` as the item_slot to get spy's watches

export function saveJsonToFile(name: string, stuff: any) {
    fs.writeFileSync(path.join(__dirname, name), JSON.stringify(stuff, null, 4))
}

export function readJsonFromFile(fileName: string): any {
    const filePath = path.join(__dirname, fileName)
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
}

/**
 * # Example:
 * HelloThere -> Hello There
 */
function PascalToSpaceSeparated(name: string): string {
    return name.replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, char => char.toUpperCase())
}

const STOCK_WEAPON_START_INDEX = 190
const STOCK_WEAPON_END_INDEX = 211
const isStock = (defindex: number): boolean => 
    defindex >= STOCK_WEAPON_START_INDEX && defindex <= STOCK_WEAPON_END_INDEX

export function sanitize(items: Item[]): Weapon[] {
    console.log(`total items: ${items.length}`)

    // if one of those is not present, it's not a valid weapon
    const weaponSlots = [
        "primary", 
        "secondary", 
        "melee"
    ]

    // below this treshold there's stock weapons some of which are more painful to deal with than the duplicated ones that show up later
    const minIndexTreshhold = 29  

    const excludedNameSegments = [
        'Festive',  // festives
        'Botkiller',  // mvms
        'Promo',  // promo item dupes
        'Slot Token',  
        'concealedkiller_',  // not sure what the following ones are even for but they're all dupes
        'craftsmann_',
        'teufort_',
        'powerhouse_',
        'harvest_',
        'pyroland_',
        'gentlemanne_',
        'warbird_',
    ]

    // some names are here despite the above filters
    // NOTE: these are not list indexes, but rather the defindex numbers, aka the weapon ids
    const indexesToRemove = [
        294,  // lugermoth duplicate
        850,  // mvm weapon used by robo heavies
        1184  // another mvm robo heavy weapon
    ]

    const sanitized = items
        .filter(item => weaponSlots.includes(item.item_slot))
        .filter(item => item.defindex > minIndexTreshhold)
        .filter(item => !excludedNameSegments.some(segment => item.name.includes(segment)))
        .filter(item => !indexesToRemove.includes(item.defindex))
        .map(item => {
            const name = processName(item)
            const stock = isStock(item.defindex)

            const weapon: Weapon = {
                _id: item.defindex,
                name: name,
                stock: stock,
                item_name: item.item_name,
                item_slot: item.item_slot as ItemSlot,
                image_url: item.image_url,
                image_url_large: item.image_url_large,
                used_by_classes: item.used_by_classes as Merc[],
                per_class_loadout_slots: item.per_class_loadout_slots as Partial<Record<Merc, string>>
            }

            return weapon
        })

    console.log(`valid weapons: ${sanitized.length}`)

    return sanitized
}

function processName(item: Item): string {
    // some names have no other data available to use for renaming
    // so those sadly have to be hardcoded
    const namesToFix: { [key: number]: string } = {
        160: "Lugermoth",
        161: "Big Kill",
        193: "Kukri",
        207: "Stickybomb Launcher",  // except this name is contained in a model name but whatever
        811: "The Huo-Long Heater",  // typo in original name
        1153: "The Panic Attack"
    }

    if (namesToFix[item.defindex]) {
        return namesToFix[item.defindex];
    }

    if (isStock(item.defindex)) {
        const prefixToRemove = "#TF_Weapon_"
        const pascalItemName = item.item_name.slice(prefixToRemove.length)
        return PascalToSpaceSeparated(pascalItemName)
    }

    return item.name
}