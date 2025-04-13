import { GetTeamReturn, DataKpisProps, GetKpisReturn} from "@/types/interfacesSql"
import {NormalizeDataKpisProps} from "@/types/interfaceClass"

export async function getTeams(): Promise<GetTeamReturn> {
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
                nuclei:TeamNuclei (
                    nuclei:Nuclei (
                    name
                    )
                )
                `
            })
        });

        return { st: true, value: await res.json() };
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        return { st: false, value: [] };
    }
}

export async function getKpis(): Promise<GetKpisReturn> {
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                table: 'DataKpi',
                select: `*, kpi: Kpis ( id, name )`
            })
        });

        const data = await res.json()

        return { st: true, value: await normalizeKPIData(data)};
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        return { st: false, value: [] };
    }

    async function normalizeKPIData(items: DataKpisProps[]): Promise<NormalizeDataKpisProps[]> {
        const grouped: Record<string, NormalizeDataKpisProps> = {}
      
        items.forEach((item) => {
          const title = item.kpi.name
      
          if (!grouped[title]) {
            grouped[title] = {
              title,
              data: [],
            }
          }
      
          grouped[title].data.push({
            name: item.name,
            values: item.value,
            color: item.color,
          })
        })
      
        return Object.values(grouped)
      }
}



