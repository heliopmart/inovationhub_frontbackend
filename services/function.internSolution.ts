import { GetTeamReturn} from "@/types/interfacesSql"

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


