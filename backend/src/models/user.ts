export interface Auth0User {
    user_id: string
    email?: string
    name?: string
    nickname?: string
    created_at: string
}

export interface TokenResponse {
    access_token: string
}