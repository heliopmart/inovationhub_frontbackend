import {NormalizeFinanceDocsProps} from "@/types/interfaceClass"
import {FinanceDocs} from "@/types/interfaceDashboardSql"

export async function getGovernanceDocs() { // : Promise<GetKpisReturn>
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                table: 'GovernanceDoc',
                select: `name, doc: Doc (*)`
            })
        });

        const data = await res.json()

        return { st: true, value: await groupDocsByName(data)};
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        return { st: false, value: [] };
    }

    async function groupDocsByName(data: FinanceDocs[]): Promise<NormalizeFinanceDocsProps[]> {
        const grouped: Record<string, NormalizeFinanceDocsProps> = {}
      
        data.forEach((item) => {
          const { name, doc } = item
      
          if (!grouped[name]) {
            grouped[name] = {
              title: name,
              files: [],
            }
          }      
          grouped[name].files.push({link: doc.download, name: doc.name})
        })
      
        return Object.values(grouped)
      }
}


