import {} from "@/types/interfacesSql"

export interface ReturnTeamsWithTeamMemberProps{
    st: boolean,
    value: TeamsWithTeamMemberProps[]
}

export interface TeamsWithTeamMemberProps{
    id: string;
    name: string;
    color: string;
    status: string;
    description: string,
    teamMember: {
        memberId: string
        role: string
        roleTeam: string
    }[]
}

export interface ReturnTeamsByRootPage{
    st: boolean,
    value: TeamsByRootPageProps[]  
}

export interface TeamsByRootPageProps{
    id: string,
    Team: {
        id: string
        name: string,
        color?: string
    }  
    art: {
        id: string,
        name: string
    }
}

// TEAMS

export interface TeamDashboardComplete{
    id: string;
    name: string;
    image: string;
    icon: string;
    description: string;
    color: string;
    createAt: string;
    description_innovation: string;
    status: string;
    totalInvestmentAllocated: number;
    totalValueAllocated: number;
    teamMembers: TeamMember[];
    investorInvestments: InvestorInvestment[];
    teamResources: TeamResource[];
    teamArts: TeamArt[];
    teamBids: TeamBids[];
    teamInscriptions: TeamInscription[];
}

export interface ArtDashboardComplete{
    id: string;
    name: string;
    type: string;
    status: string;
    linkDoc: string;
    totalInvestmentAllocated: number;
    totalValueAllocated: number;
    observation: string;
    limitDate: string;
    createdAt: string;
    updatedAt: string;
    teamArts: {
        team: TeamDashboardComplete
    }[]
    teamMembers: TeamMember[];
    teamBids: TeamBids[];
}

export interface GetTeamCompleteReturn{
    st: boolean,
    value: TeamDashboardComplete | [] | null
    table?: any
}

export interface GetArtCompleteReturn{
    st: boolean,
    value: ArtDashboardComplete | [] | null
    table?: any
}

// Interface para o usuário
interface User {
    id: string;
    name: string;
    color: string;
    image: string;
    createAt: string;
    updateAt: string;
    admin: boolean;
    type: string;
    tell?: string;
    participatingTeams: number;
    amountOfLeadership: number;
    reportsDelivered: number;
    graduations: string[];
    finishedArts: number;
}

// Interface para membros do time
export interface TeamMember {
    id: string;
    teamId: string;
    memberId: string;
    role: string;
    roleTeam: string;
    punishment: number;
    allocatedArt: string;
    createAt: string;
    user: User;
}

// Interface para investidores
interface Investor {
    id: string;
    name: string;
    descriptionInvestment: string;
    description: string;
    image: string;
    icon: string;
    link: string;
    type: string;
    createAt: string;
    updateAt: string;
    color: string;
}

// Interface para investimentos realizados pelo time
interface InvestorInvestment {
    id: string;
    investorId: string;
    name: string;
    type: string;
    value: number;
    specificInvestment: boolean;
    createAt: string;
    investmentFor: string;
    investor: Investor;
}

// Interface para recursos
export interface Resource {
    id: string;
    name: string;
    value: number;
    purchase: string;
    timeUse: string;
    status: string;
    attention: boolean;
    attentionDescription: string;
    serialNumber: string;
    lastMaintenance: string;
    nextMaintenance: string;
    accountableId: string;
    createAt: string;
    updateAt: string;
}

// Interface para recursos do time
interface TeamResource {
    id: string;
    teamId: string;
    resourceId: string;
    createAt: string;
    resource: Resource;
}

// Interface para artes
export interface Art {
    id: string;
    name: string;
    type: string;
    status: string;
    linkDoc: string;
    totalInvestmentAllocated: number;
    totalValueAllocated: number;
    observation: string;
    limitDate: string;
    createdAt: string;
    updatedAt: string;
}

// Interface para artes do time
interface TeamArt {
    id: string;
    teamId: string;
    artId: string;
    createAt: string;
    art: Art;
    leaderName?: string
}

// Interface para licitações
interface Bids {
    id: string;
    code: string;
    type: string;
    status: string;
    linkDoc: string;
    createdAt: string;
    updatedAt: string;
}

// Interface para licitações do time
interface TeamBids {
    id: string;
    teamId: string;
    bidId: string;
    artId: string;
    createAt: string;
    bid: Bids;
}

// Interface para inscrições no time
interface TeamInscription {
    id: string;
    teamId: string;
    userId: string;
    document: string;
    createAt: string;
    user: User;
}
