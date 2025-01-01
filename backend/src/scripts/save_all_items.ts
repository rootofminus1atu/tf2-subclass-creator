import axios, { AxiosResponse } from 'axios'
import dotenv from 'dotenv'
import { sanitize, saveJsonToFile } from './helpers'
dotenv.config()

const steam_key = process.env.STEAM_API_KEY
const url = (start: number) => `https://api.steampowered.com/IEconItems_440/GetSchemaItems/v0001/?key=${steam_key}&start=${start}`


interface SteamResponse {
    result: SteamResponseResult
}

interface SteamResponseResult {
    status: number,
    items: Item[],
    next?: number
}

export interface Item {
    defindex: number,
    name: string,
    item_name: string,
    item_slot: string,
    image_url: string,
    image_url_large: string,
    used_by_classes?: string[],  // if not present, everyone can use it
    per_class_loadout_slots?: { [key: string]: string }
}


async function main() {
    let start: number | undefined = 0
    const items: Item[] = [] 

    while (start !== undefined) {
        let res: AxiosResponse<SteamResponse> = await axios.get(url(start))
        let data = res.data.result

        items.push(...data.items)

        start = data.next 
        console.log(start)
    }

    // saveJsonToFile("items.json", items)  40k lines btw, it's a huge file


    saveJsonToFile("all_items.json", items)
}

main().catch(console.error)