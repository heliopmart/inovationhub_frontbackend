import {GetNucleiReturn,ReturnDirectoryInformation, ReturNormalizeNucleiDirector} from "@/types/interfacesSql"

export async function getNucleiDirectors(): Promise<GetNucleiReturn> {
    try {
      const res = await fetch('/api/query/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': 'public_xyz'
        },
        body: JSON.stringify({
          table: 'Nuclei',
          select: `
            id,
            name,
            NucleiBoardOfDirectors (
              role,
              user:User (
                name,
                tell,
                login:UserLogin (
                  email
                )
              )
            )
          `
        })
      });
  
      return { st: true, value: await normalizeObject(await res.json()) };
    } catch (ex) {
      console.error("function.nuclei > getNucleiDirectors | Error: " + ex);
      return { st: false, value: [] };
    }
}

async function normalizeObject(data:ReturnDirectoryInformation[]): Promise<ReturNormalizeNucleiDirector[] | []> {
    try{
        return data.map((nuclei) => ({
            name: nuclei.name,
            roles: {
                director: {
                    textRole: "Diretor do núcleo",
                    name: nuclei?.NucleiBoardOfDirectors[0]?.user?.name,
                    email: nuclei?.NucleiBoardOfDirectors[0]?.user?.login[0]?.email,
                    tell: nuclei?.NucleiBoardOfDirectors[0]?.user?.tell
                },
                coordinator: {
                    textRole: "Coordenador docente do núcleo",
                    name: nuclei?.NucleiBoardOfDirectors[1]?.user.name, 
                    email: nuclei?.NucleiBoardOfDirectors[1]?.user.login[0].email,
                    tell: nuclei?.NucleiBoardOfDirectors[1]?.user.tell
                }
            }
        }))
    }catch(e){
        return []
    }
}
