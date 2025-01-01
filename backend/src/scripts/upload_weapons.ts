import dotenv from 'dotenv'
import { closeDb, connectToDb, getWeaponsCollection } from '../database'
import { Weapon } from '../models/weapon'
import { readJsonFromFile } from './helpers'
dotenv.config()

async function main() {
    await connectToDb()
    const weaponsCollection = getWeaponsCollection()

    console.log('deleting existing weapons')
    await weaponsCollection.deleteMany({})
    console.log('deleted existing weapons')

    const weapons: Weapon[] = readJsonFromFile('weapons.json')

    console.log('inserting')
    const res = await weaponsCollection.insertMany(weapons)
    console.log(`inserted ${res.insertedCount} weapons`)
}

main().catch(console.error).finally(async () => { await closeDb() })

