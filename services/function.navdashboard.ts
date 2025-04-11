import {NavTeamProps} from "@/types/interfaceClass"
export async function exitAccount(){
    try {
        const res = await fetch('/api/auth/auth.exit', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const response = await res.json()

        console.log(response)

        if(response.error){
            return false
        }

        if(res.status === 200){
            return true
        }


        return false
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        return false
    }
}

export async function getUserTeams():Promise<boolean | NavTeamProps[]>{
    try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) throw new Error('Usuário não autenticado');

        const userData = await response.json();
        const IDUser = userData.user.id
    
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'TeamMember',
                select: `team: Team (name,id,color)`,
                filter: [
                    {
                        column: 'memberId',
                        op: 'eq',
                        value: IDUser
                    }
                ]
            })
        });
        
        if(res.status !== 200){
            return false
        }

        const data = await res.json()

        return data;
    } catch {
        return false
    }
}