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

export interface TokenVerifyProps{
    status: boolean,
    allowedTables: string[],
}

export interface authUser{
    token: string,
    user: {
        id: string,
        name: string,
        admin: string,
        image: string,
        teamMember: {
            id: string,
            teamId: string,
            role: string,
            roleTeam: string,
        }
    }
}