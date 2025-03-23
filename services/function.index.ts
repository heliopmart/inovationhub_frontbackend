import {GetReturn} from "@/types/interfacesSql"

export async function getTeams():Promise<GetReturn>{
    try{
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'Team',
                select: 'name, icon'
            })
        });

        return {st: true, value: await res.json()}
    }
    catch(ex){
        console.error("function.index > getTeams | Error: " + ex)
        return {st: false, value: []}
    }
}

export async function getInvestor():Promise<GetReturn>{
    try{
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'Investor',
                select: 'name, icon' 
            })
        });

        return {st: true, value: await res.json()}
    }
    catch(ex){
        console.error("function.index > getInvestor | Error: " + ex)
        return {st: false, value: []}
    }
}