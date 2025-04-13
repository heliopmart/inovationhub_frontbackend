import {GetNucleiReturn,ReturnDirectoryInformation, ReturNormalizeNucleiDirector} from "@/types/interfacesSql"

export async function getNucleiDirectors(): Promise<GetNucleiReturn> {
    try {
      const res = await fetch('/api/query/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: 'MemberNuclei',
          select: `*, nuclei: Nuclei ( * ), user: User ( id, name, color, tell )`
        })
      });
  
      const data = (await res.json())

      return { st: true, value: await normalizeByNuclei(data) };
    } catch (ex) {
      console.error("function.nuclei > getNucleiDirectors | Error: " + ex);
      return { st: false, value: [] };
    }
}

async function normalizeByNuclei(data: ReturnDirectoryInformation[]): Promise<ReturNormalizeNucleiDirector[]> {
    const grouped: Record<string, ReturNormalizeNucleiDirector> = {}
  
    data.forEach(({ nuclei, user, role }) => {
      if (!grouped[nuclei.id]) {
        grouped[nuclei.id] = {
          name: nuclei.name,
          roles: {
            coordinator: null,
            director: null,
          }
        }
      }
  
      const normalizedUser = {
        textRole: role === 'coordinator' ? 'Coordenador(a)' : 'Diretor(a)',
        name: user.name,
        email: "",
        tell: user.tell ?? null,
      }
  
      if (role === 'coordinator') {
        grouped[nuclei.id].roles.coordinator = normalizedUser
      } else if (role === 'leader') {
        grouped[nuclei.id].roles.director = normalizedUser
      }
    })
  
    return Object.values(grouped)
  }