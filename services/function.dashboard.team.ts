import { ReturnTeamsWithTeamMemberProps, ReturnTeamsByRootPage, GetTeamCompleteReturn, GetArtCompleteReturn} from "@/types/interfaceDashboardSql"
import {TeamMember, Art} from "@/types/interfaceDashboardSql"
import {getBaseUrl} from "@/lib/baseUrl"

export async function getTeams(memberId: string): Promise<ReturnTeamsWithTeamMemberProps> {
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'Team',
                select: `
                    id,
                    name,
                    color,
                    status,
                    image,
                    description,
                    teamMember:TeamMember (
                        memberId,
                        role, 
                        roleTeam
                    )
                `,
            })
        });

        const data = await res.json();

        const returnDataFilter = data.map((team: any) => ({
            ...team,
            teamMember: team.teamMember.filter((member: any) => member.memberId === memberId)
        }));

        return { st: true, value: returnDataFilter };
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        return { st: false, value: [] };
    }
}

export async function getTeamsByRootPage(memberId: string): Promise<ReturnTeamsByRootPage> {        
    try {
        const res = await fetch(`${getBaseUrl()}/api/query/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'TeamMember',
                select: 'id, Team(id, name, color), art: Art (name, id)',
                filter: [
                    { column: 'memberId', op: 'eq', value: memberId }
                ]
            })
        });

        const data = await res.json();
        return { st: true, value: data};
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        return { st: false, value: [] };
    }
}

export async function getTeamDashboardComplete(teamId: string): Promise<GetTeamCompleteReturn> {
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'Team',
                select: `
                    *,
                    teamMembers: TeamMember (
                        *,
                        user: User (
                            id,
                            name,
                            color,
                            image,
                            createAt,
                            updateAt,
                            graduations,
                            admin,
                            type,
                            tell,
                            participatingTeams,
                            amountOfLeadership,
                            reportsDelivered,
                            finishedArts
                        )
                    ),
                    investorInvestments: InvestorInvestment (
                        *,
                        investor: Investor (
                            id,
                            name,
                            descriptionInvestment,
                            description,
                            image,
                            icon,
                            link,
                            type,
                            createAt,
                            updateAt,
                            color
                        )
                    ),
                    teamResources: TeamResource (
                        *,
                        resource: Resource (
                            id,
                            name,
                            value,
                            purchase,
                            timeUse,
                            status,
                            attention,
                            attentionDescription,
                            serialNumber,
                            lastMaintenance,
                            nextMaintenance,
                            accountableId,
                            createAt,
                            updateAt
                        )
                    ),
                    teamArts: TeamArt (
                        *,
                        art: Art (
                            id,
                            name,
                            type,
                            status,
                            linkDoc,
                            totalInvestmentAllocated,
                            totalValueAllocated,
                            observation,
                            limitDate,
                            createdAt,
                            updatedAt
                        )
                    ),
                    teamBids: TeamBids (
                        *,
                        bid: Bids (
                            id,
                            code,
                            type,
                            status,
                            linkDoc,
                            createdAt,
                            updatedAt
                        )
                    ),
                    teamInscriptions: TeamInscription (
                        *,
                        user: User (
                            id,
                            name,
                            color,
                            image,
                            createAt,
                            updateAt,
                            admin,
                            type,
                            tell,
                            participatingTeams,
                            amountOfLeadership,
                            reportsDelivered,
                            finishedArts
                        )
                    )
                `,
                filter: [
                    { column: 'id', op: 'eq', value: teamId }
                ]
            })
        });        

        const data = (await res.json())[0];
        const artNormalize = await addingNameLeaderInArt(data.teamArts, data.teamMembers)

        data.teamArts = artNormalize

        return { st: true, value: data };
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        return { st: false, value: [] };
    }

    function addingNameLeaderInArt(teamArt:Art[], teamMember:TeamMember[]){
        const art = []

        for (let i = 0; i < teamArt.length; i++) {
            const element_art = teamArt[i];
            for (let j = 0; j < teamMember.length; j++) {
                const element_member = teamMember[j];
                
                if(element_art.id === element_member.allocatedArt && element_member.roleTeam == "allocatedLeader"){
                    art.push({...element_art, leaderName: element_member.user.name})
                }
            }
        }

        return art
    }
}

export async function getArtDashboardComplete(artId: string): Promise<GetArtCompleteReturn> {
    try {
        // 1. Consulta para obter os dados da Art
        const artRes = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'Art',
                select: `
                    *,
                    teamArts: TeamArt (
                        team: Team (
                            id,
                            name,
                            color,
                            icon,
                            image,
                            description,
                            description_innovation,
                            status,
                            totalInvestmentAllocated,
                            totalValueAllocated,
                            createAt,
                            teamResources: TeamResource (*, resource: Resource(*))
                        )
                    )
                `,
                filter: [
                    { column: 'id', op: 'eq', value: artId }
                ]
            })
        });

        const bidsRes = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'TeamBids',
                select: `
                    id,
                    teamId,
                    bidId,
                    artId,
                    createAt,
                    bid: Bids (
                        id,
                        code,
                        type,
                        status,
                        linkDoc,
                        createdAt,
                        updatedAt
                    )
                `,
                filter: [
                    { column: 'artId', op: 'eq', value: artId }
                ]
            })
        });

        const membersRes = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'TeamMember',
                select: `
                    *,
                    user: User (
                        id,
                        name,
                        color,
                        image,
                        createAt,
                        updateAt,
                        admin,
                        type,
                        tell,
                        participatingTeams,
                        amountOfLeadership,
                        reportsDelivered,
                        finishedArts
                    )
                `,
                filter: [
                    { column: 'allocatedArt', op: 'eq', value: artId }
                ]
            })
        });

        const artData = (await artRes.json())[0];
        const membersData = await membersRes.json();
        const bidsData = await bidsRes.json();

        // 3. Unindo os dados no formato esperado
        const finalData = {
            ...artData,
            teamBids: bidsData,
            teamMembers: membersData
        };

        return { st: true, value: finalData };
    } catch (ex) {
        console.error("function.art > getArtDashboardComplete | Error: " + ex);
        return { st: false, value: [] };
    }
}