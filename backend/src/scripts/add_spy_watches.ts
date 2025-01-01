import { Weapon, ItemSlot, Merc } from '../models/weapon';
import { Item } from './save_weapons';
import { readJsonFromFile } from './helpers';
import { connectToDb, getWeaponsCollection } from '../database';


async function main() {
    const items: Item[] = readJsonFromFile('spy_watches.json')

    const weapons = items.map(item => {
        const stock = item.defindex === 212 ? true : false

        const weapon: Weapon = {
            _id: item.defindex,
            name: item.name,
            stock,
            item_name: item.item_name,
            item_slot: ItemSlot.primary,  // bandaid fix, all spy watches are now primary
            image_url: item.image_url,
            image_url_large: item.image_url_large,
            used_by_classes: item.used_by_classes as Merc[],
            per_class_loadout_slots: item.per_class_loadout_slots as Partial<Record<Merc, string>>
        };
        return weapon
    })

    console.log(weapons)  // all ok

    console.log('connecting to db')
    await connectToDb()
    const weaponsCollection = getWeaponsCollection()
    console.log('connected')

    const res = await weaponsCollection.insertMany(weapons)
    console.log(`inserted ${res.insertedCount} weapons`)
}

main().catch(console.error)