import {CoordinatorToArtProps} from "@/types/interfaceDashboardSql"
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

// 

export interface NormalizeDataKpisProps{
    title: string,
    data: {
        name: string,
        color: string,
        values: number[]
    }[]
}

export interface NormalizeFinanceDocsProps{
    title: string
    files: {
        name: string,
        link: string
    }[]
}

export interface DataCreateContactProps{
    email: string,
    economicSector: string,
    representativeName: string,
    positionRepresentative: string,
    nameInterprise: string
}

export interface UserToLeaderProps{
    id: string
    name: string
    graduation: string[]
    amountOfLeadership: number
    finishedArts: number
    linkDoc: string
}
export interface ComponentUsersToLeaderARTProps {
    selectLeader: (userId:string) => void 
    downloadDoc: (linkDoc:string) => void
    data: UserToLeaderProps[]
}

export interface GetTeamMemberForArtLeaderReturn {
    st: boolean,
    value: UserToLeaderProps[]
}

export interface getTeamCoordinatorForArtReturn{
    st: boolean,
    value: CoordinatorToArtProps[]
}