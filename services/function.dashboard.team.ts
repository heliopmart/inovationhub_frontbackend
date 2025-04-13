import { ReturnTeamsWithTeamMemberProps, TeamsWithTeamMemberProps, GetTeamCompleteReturn, GetArtCompleteReturn} from "@/types/interfaceDashboardSql"
import {TeamMember, Art, TeamMemberForArtLeaderProps, CoordinatorToArtProps} from "@/types/interfaceDashboardSql"
import {authUser, UserToLeaderProps, GetTeamMemberForArtLeaderReturn, getTeamCoordinatorForArtReturn} from "@/types/interfaceClass"
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

async function getAllTeams(): Promise<ReturnTeamsWithTeamMemberProps> {
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
                    color
                `,
            })
        });

        
        const data = await res.json();
        return { st: true, value: data };
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        return { st: false, value: [] };
    }
}

export async function setTeamViwer(team:TeamsWithTeamMemberProps, teamMember: any){
    const url = `/api/cookie/set`

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idTeam: team.id,
            colorTeam: team.color,
            nameTeam: team.name,
            roleTeam: teamMember.roleTeam,
            artAllocatedTeam: teamMember.allocatedArt
        })
    })

    if(res.status === 200){
        return true
    }else{
        return false
    }
}

export async function getTeamViwer(){
    const url = `/api/cookie/get`

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const data = await res.json();

    if(res.status === 200){
        return data
    }else{
        return {}
    }
}

export async function getTeamMember(authUser: authUser, teamName: string){    
    const requestTeams = await getAllTeams()
    const teamMemberByUser = authUser.user.teamMember


    if(!requestTeams.st){
        return {
            team: {},
            teamMember: teamMemberByUser[0]
        }
    }

    const team = requestTeams.value

    if(!teamName){
        return {
            team: {},
            teamMember: teamMemberByUser[0]
        }
    }


    if(!Array.isArray(teamMemberByUser)){
        return {
            team: team.filter((team) => team.name === teamName)[0],
            teamMember: teamMemberByUser[0]
        }
    }

    const getTeamByName = team.filter((team) => team.name === teamName)[0]

    if(!getTeamByName){
        return {
            team: {},
            teamMember: teamMemberByUser[0]
        }
    }    

    await setTeamViwer(getTeamByName, teamMemberByUser.filter((teamMember) => teamMember.teamId == getTeamByName.id)[0])
    return {
        team: getTeamByName,
        teamMember: teamMemberByUser.filter((teamMember) => teamMember.teamId == getTeamByName.id)[0]
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
                            finishedArts,
                            graduations
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

    function addingNameLeaderInArt(teamArt: any[], teamMember: TeamMember[]) {
        return teamArt.map((element_art) => {
          const leader = teamMember.find(
            (m) =>
              m.allocatedArt === element_art.art.id &&
              m.roleTeam === "allocatedLeader"
          );
      
          return {
            ...element_art,
            leaderName: leader?.user.name
          };
        });
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


export async function getTeamMemberForArtLeader(teamId:string) : Promise<GetTeamMemberForArtLeaderReturn>{
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                table: 'TeamMember',
                select: `
                    user: User (
                        name, 
                        id, 
                        type,
                        graduations,
                        amountOfLeadership,
                        finishedArts
                    )
                `,
                filter: [
                    { column: 'teamId', op: 'eq', value: teamId },
                    { column: 'roleTeam', op: 'eq', value: "member" }
                ]
            })
        });

        const data = await res.json();
        return { st: true, value: await normalizeUsers(data) };
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        return { st: false, value: [] };
    }

    async function normalizeUsers(data: TeamMemberForArtLeaderProps[]): Promise<UserToLeaderProps[]> {
        return data.map((entry) => {
          const { id, name, graduations, amountOfLeadership, finishedArts } = entry.user
          return {
            id,
            name,
            graduation: graduations,
            amountOfLeadership,
            finishedArts,
            linkDoc: ""
          }
        })
      }
}

export async function getTeamCoordinatorForArt(teamId:string) : Promise<getTeamCoordinatorForArtReturn>{
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                table: 'TeamMember',
                select: `
                    user: User (
                        name, 
                        id
                    )
                `,
                filter: [
                    { column: 'teamId', op: 'eq', value: teamId },
                    { column: 'role', op: 'eq', value: "coordinator" }
                ]
            })
        });

        const data = await res.json();
        return { st: true, value: await normalizeUsers(data) };
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        return { st: false, value: [] };
    }

    async function normalizeUsers(data: any[]): Promise<CoordinatorToArtProps[]> {
        return data.map((entry) => {
          const { id, name} = entry.user
          return {
            id,
            name
          }
        })
      }
}