
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
