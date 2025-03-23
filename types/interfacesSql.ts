
// Team
export interface TeamMinify {
    id: string;
    name: string;
    color: string;
    status: string;
    image: string,
    description: string,
    nuclei?: [
        {
            nuclei?: {
                name: string;
            }
        }
    ]
    direction?: string
}

// Icons and name by Team and Investor
export interface ReturnNameIcon{
    name: string,
    icon: string
}

export interface GetReturn{
    st: boolean,
    value: ReturnNameIcon[]
}

// Nuclei
export interface ReturnDirectoryInformation{
    id: string,
    name: string,
    NucleiBoardOfDirectors: {
        role: string,
        user: {
            name: string,
            tell: string,
            login: {
                email: string
            }[]
        }
    }[]
}

export interface ReturNormalizeNucleiDirector{
    name: string,
    roles: {
        director: {
            textRole: string
            name: string,
            email: string,
            tell: string
        },
        coordinator: {
            textRole: string,
            name: string, 
            email: string,
            tell: string
        }
    }
}

export interface GetNucleiReturn{
    st: boolean,
    value: ReturNormalizeNucleiDirector[]
}

// Team Minify

export interface GetTeamReturn{
    st: boolean,
    value: TeamMinify[]
}

export interface Events{
    id: string,
    name: string,
    local: string,
    date: string,
    link: string,
    held: boolean,
    minifyDescription: string,
    description: string,
    registrationsMade: number,
    sponsors: [
        {
            investor: {
                name: string
            }
        }
    ]
}

export type valueEventsReturn = {
    event: Events[]
    eventHeld: Events[]
}

export interface GetEventsReturn{
    st: boolean,
    value: valueEventsReturn
}

// 

// Investor
export interface Investor {
    id: string;
    name: string;
    descriptionInvestment: string;
    description: string;
    type: string;
    image: string;
    color: string,
    link: string
    direction?: string
}

export interface GetInvestorReturn{
    st: boolean,
    value: Investor[]
}


// Resources -------

export interface Resource{
    id: string
    name: string,
    value: string,
    purchase: Date,
    timeUse: Date,
    status: string,
    attention :boolean,
    attentionDescription: string,
    serialNumber: string,
    lastMaintenance: Date,
    nextMaintenance: Date,
    user?: {
        name: string
    },
    createAt: Date,
    updateAt: Date
}

export interface GetResourceReturn{
    st: boolean,
    value: Resource[]
    table?: any
}

export interface InvestorInvestment{
    type: string,
    value: string,
    specificInvestment: boolean,
    createAt: string,
    investor: {
        name: string,
    },
    team: {
        name: string
    }
}

export interface GetInvestmentsReturn{
    st: boolean,
    value: Resource[]
    table?: any
}

// 

export interface Transfers{
    name: string,
    type: string,
    createAt: string,
    value: string,
    specificInvestment: boolean,
    investor: {
        name: string
    }
}

export interface GetTransfersReturn{
    st: boolean,
    value: Transfers[]
    table?: any
}

// 

export interface Expenses{
    name :string,
    timeSupplier: string,
    totalAmountInvested: string,
    evaluation: string,
    resource: {
        name: string,
        value: string,
        status: string
    }
}

export interface GetExpensesReturn{
    st: boolean,
    value: Transfers[]
    table?: any
}

// 

export interface Bids{
    id: string,
    code: string,
    linkDoc: string,
    status: string,
    type: string,
    createAt: string,
    responseAt: string
}

export interface GetBidsReturn{
    st: boolean,
    value: Bids[]
    table?: any
}

// -----------

export type InvestorTeamCompleat = {
    type: string,
    direction?: string 
    investor: {
        id: string,
        name: string,
        type: string
        description: string
        image: string,
        descriptionInvestment: string
        link: string,
        color: string,
    }
}

export type DocsNormilize = {
    name: string,
    files: {
        name: string,
        link: string
    }
}

export interface TeamComplete{
    id: string;
    name: string;
    icon: string
    color: string;
    status: string;
    image: string,
    description: string,
    direction?: string
    createAt: Date
    description_innovation: string,
    totalInvestmentAllocated: Float16Array

    members: [
        {
            role: string,
            roleTeam: string,
            member: {
                id: string,
                name: string,
                color: string,
                email: string,
                type: string,
                image: string,
                graduations: string[]
                socialMedia: {
                    type: string,
                    link: string
                }[]
            }
        }
    ]

    investors: InvestorTeamCompleat[]

    resources: {
        resource: {
            id: string,
            name: string,
            value: string,
            status: string,
            user: {
                name: string
            }
        }
    }[]
    

    docs: {
        name: string,
        files: {
            name: string,
            type: string,
            download: string
        }
    }[]

    arts: {
        files: {
            type: string,
            status: string,
            linkDoc: string
        }
    }[]

    bids: {
        type: string,
        status: string,
        linkDoc: string
    }[]

    contact: {
        role: string,
        email: string
    }[]
}

export interface GetTeamCompleteReturn{
    st: boolean,
    value: TeamComplete | null
    table?: any
}
