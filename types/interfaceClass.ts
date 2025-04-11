export interface AuthPrivatedToken{
    status: boolean,
    message?: string
    allowedTables?: string[]
}

export interface authMinifyProps {
    role: string,
    leader: boolean
}

export interface TokenVerifyProps{
    status: boolean,
    allowedTables: string[],
}

export type teamMemberByAuthuserProps = {
    id: string,
    teamId: string,
    role: string,
    roleTeam: string,
    allocatedArt: string
}

export interface authUser{
    token: string,
    user: {
        id: string,
        name: string,
        admin: string,
        image: string,
        teamMember: teamMemberByAuthuserProps[]
    }
}

export interface DashboardInformationsProps {
    idTeam: string,
    colorTeam: string,
    nameTeam: string,
    roleTeam: string,
    artAllocatedTeam: string
}

export interface NavTeamProps{
    team: {
        id: number,
        name: string,
        color: string
    }
}
