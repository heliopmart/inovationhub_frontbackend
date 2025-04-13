import { NormalizeFinanceDocsProps, DataCreateContactProps } from "@/types/interfaceClass"
import { FinanceDocs } from "@/types/interfaceDashboardSql"

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

        return { st: true, value: await groupDocsByName(data) };
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
            grouped[name].files.push({ link: doc.download, name: doc.name })
        })

        return Object.values(grouped)
    }
}

export async function createPartnersContact(data: Record<string, any>) {
    try {
      const formData = new FormData();
  
      for (const key in data) {
        const value = data[key];
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
      
      const res = await fetch("/api/query/createContact", {
        method: "POST",
        body: formData, // ❌ não coloque 'Content-Type' manualmente!
      });
  
      if (res.status === 200) {
        return { st: true, value: "Cadastro realizado com sucesso" };
      }
  
      const result = await res.json();
      console.log(result)
      return { st: false, value: result?.error || "Erro ao cadastrar" };
    } catch (ex) {
      console.error("createPartnersContact | Error:", ex);
      return { st: false, value: "Erro inesperado ao cadastrar" };
    }
  }