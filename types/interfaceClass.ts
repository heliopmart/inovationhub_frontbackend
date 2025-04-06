export interface AuthPrivatedToken{
    status: boolean,
    message?: string
    allowedTables?: string[]
}

export interface authProps{
    auth: boolean,
    user: {
        id: string,
        role: string,
        admin: boolean,
        allocatedArt: string
    }
}

export interface authMinifyProps {
    role: string,
    leader: boolean
}