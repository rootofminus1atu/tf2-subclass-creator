import { MongoClient, Db, Collection } from 'mongodb'
import dotenv from 'dotenv'
import { Weapon } from './models/weapon'
import { Loadout } from './models/loadout'
dotenv.config()

const uri = process.env.MONGO_URI || ""
const dbName = 'tf2sc'

let client: MongoClient
let db: Db

export async function connectToDb(): Promise<Db> {
    if (!client) {
        client = new MongoClient(uri)
        await client.connect()
        db = client.db(dbName)
    }

    return db
}

export function getWeaponsCollection(): Collection<Weapon> {
    if (!db) {
        throw new Error("Db not connected, call `connectToDb` first.")
    }

    return db.collection<Weapon>('weapons')
}

export function getLoadoutsCollection(): Collection<Loadout> {
    if (!db) {
        throw new Error("Db not connected, call `connectToDb` first.")
    }
     
    return db.collection<Loadout>('loadouts')
}

export async function closeDb(): Promise<void> {
    if (client) {
        await client.close();
    }
}