import { FullLoadout } from "./loadout"

export interface Identity {
    connection: string
    user_id: string
    provider: string
    isSocial: boolean
}
  
export interface User {
    name: string
    nickname: string
    created_at: string
    picture: string
    email_verified: boolean
    user_id: string
    email: string
    identities: Identity[]
    updated_at: string
    last_login: string
    last_ip: string
    logins_count: number
}

export interface UserWithLoadouts extends User {
    loadouts: FullLoadout[]
}