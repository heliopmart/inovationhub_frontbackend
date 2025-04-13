import { GetResourceReturn, GetInvestmentsReturn, GetTransfersReturn, Transfers, GetExpensesReturn, GetBidsReturn} from "@/types/interfacesSql"
import {NormalizeFinanceDocsProps} from "@/types/interfaceClass"
import {Doc, FinanceDocs} from "@/types/interfaceDashboardSql"
import { ColDef } from 'ag-grid-community';

const calcularTempoUso = (date: string) => {

    const ConvertDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - ConvertDate.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return `${diffYears} anos e ${diffMonths} meses`;
};

export async function getAllResources(): Promise<GetResourceReturn> {
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'Resource',
                select: `
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
                    createAt,
                    updateAt,
                    user:User (
                        name
                    ),
                    supplier:ResourceSupplier (
                        name
                    )
                `
            })
        });

        return { st: true, value: await res.json(), table: createTable() };
    } catch (ex) {
        console.error("getAllResources | Error: " + ex);
        return { st: false, value: [] };
    }

    function createTable(): ColDef[] {
        return [
            { field: "name", headerName: "Recurso", sortable: true, filter: true },
            { field: "value", headerName: "Valor (R$)", sortable: true, filter: "agNumberColumnFilter", valueFormatter: (params) => `R$ ${params.value.toLocaleString("pt-BR")}` },
            { field: "purchase", headerName: "Data de Compra", sortable: true, filter: true, cellRenderer: (params: { value: string }) => calcularTempoUso(params.value)  },
            { field: "timeUse", headerName: "Tempo de Uso", sortable: true, filter: true, cellRenderer: (params: { value: string }) => calcularTempoUso(params.value) },
            { field: "status", headerName: "Status", sortable: true, filter: true, cellRenderer: (params: {value:string}) => {
                if (params.value == "available") return "✅";
                if (params.value == "in_use") return "Em uso";
                if (params.value == "broken") return "Quebrado";
                return "Perdido/Sem concerto"
            }},
            {
                field: "attention", headerName: "Atenção", sortable: true, filter: true, cellRenderer: (params: boolean) => {
                    if (params === true) return "⚠️";
                    if (params === false) return "✅";
                    return "✅";
                }
            },
            { field: "attentionDescription", headerName: "Obsevação", sortable: true, filter: true },
            { field: "supplier", headerName: "Fornecedor", sortable: true, filter: true, cellRenderer: (params: { value: { name: string } }) => params.value.name },
            { field: "serialNumber", headerName: "Número de Série", sortable: true, filter: true },
            { field: "lastMaintenance", headerName: "Última Manutenção", sortable: true, filter: true, cellRenderer: (params: { value: string }) => calcularTempoUso(params.value) },
            { field: "nextMaintenance", headerName: "Próxima Manutenção", sortable: true, filter: true, cellRenderer: (params: { value: string }) => calcularTempoUso(params.value) },
            { field: "user", headerName: "Responsável Atual", sortable: true, filter: true, cellRenderer: (params: { value: { name: string } }) => params.value.name },
            { field: "updateAt", headerName: "Última Atualização", sortable: true, filter: true, cellRenderer: (params: { value: string }) => calcularTempoUso(params.value) },
        ];
    }
}

export async function getInvestorInvestments(): Promise<GetInvestmentsReturn> {
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'InvestorInvestment',
                select: `
                    type,
                    value,
                    specificInvestment,
                    createAt,
                    investor:Investor (
                        name
                    ),
                    team:Team(
                        name
                    )
                `
            })
        });

        return { st: true, value: await res.json(), table: createTable() };
    } catch (ex) {
        console.error("getInvestorInvestments | Error: " + ex);
        return { st: false, value: [] };
    }

    function createTable(): ColDef[] {
        return [
            {
                field: "type", headerName: "Tipo de investimento", sortable: true, filter: true, cellRenderer: (params: string) => {
                    if (params === "event") return "Eventos";
                    if (params === "financial") return "Financeiro";
                    if (params === "resources") return "Recursos";
                    if (params === "infrastructure") return "Infraestrutura";
                    return "Financeiro";
                }
            },
            { field: "value", headerName: "Valor (R$)", sortable: true, filter: "agNumberColumnFilter", valueFormatter: (params) => `R$ ${params.value.toLocaleString("pt-BR")}` },
            { field: "investor", headerName: "Investidor", sortable: true, filter: true, cellRenderer: (params: { value: { name: string } }) => params.value.name },
            { field: "specificInvestment", headerName: "Investimento Localizado", sortable: true, filter: true },
            { field: "team", headerName: "Investimento para", sortable: true, filter: true, cellRenderer: (params: { value: { name: string } }) => params.value.name },
            { field: "createAt", headerName: "Investido em", sortable: true, filter: true, cellRenderer: (params: { value: string }) => calcularTempoUso(params.value) },
        ];
    }
}

// TODO: O filtro não funciona
export async function getInvestorTransfer(): Promise<GetTransfersReturn> {
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'InvestorInvestment',
                select: `
                    name,
                    type,
                    createAt,
                    value,
                    specificInvestment,
                    investor:Investor (
                        name
                    )
                `,
                filter: [
                    {
                      column: 'InvestorInvestment.specificInvestment',
                      operator: 'eq',
                      value: false
                    },
                    {
                      column: 'InvestorInvestment.investmentFor',
                      operator: 'eq',
                      value: 0
                    }
                  ]
            })
        });

        const raw = await res.json();

        const value = Array.isArray(raw)
          ? raw.map((data: Transfers) => ({
              ...data,
              name: "Hub de inovações"
            }))
        : [];

        return { st: true, value: value, table: createTable() };
    } catch (ex) {
        console.error("getInvestorFullTrace | Error: " + ex);
        return { st: false, value: [] };
    }

    function createTable():ColDef[] {
        return [
           { field: "name", headerName: "Transferido para", sortable: true, filter: true },
           { field: "type", headerName: "Tipo de investimento", sortable: true, filter: true, cellRenderer: (params:string) => {
               if (params === "event") return "Eventos";
               if (params ===  "financial") return "Financeiro";
               if (params ===  "resources") return "Recursos";
               if (params ===  "infrastructure") return "Infraestrutura";
               return "Financeiro";
               }},
           { field: "value", headerName: "Valor (R$)", sortable: true, filter: "agNumberColumnFilter", valueFormatter: (params) => `R$ ${params.value.toLocaleString("pt-BR")}` },
           { field: "investor", headerName: "Investidor", sortable: true, filter: true, cellRenderer: (params:{value:{name:string}}) => params?.value?.name},
           { field: "createAt", headerName: "Investido em", sortable: true, filter: true,  cellRenderer: (params:{value:string}) => calcularTempoUso(params.value)},
       ];
   }
}

export async function getResourceExpenses(): Promise<GetExpensesReturn> {
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'ResourceSupplier',
                select: `
                    name,
                    timeSupplier,
                    totalAmountInvested,
                    evaluation
                    resource:Resource (
                        name,
                        value,
                        status
                    )
                `
            })
        });

        return { st: true, value: await res.json(), table: createTable()};
    } catch (ex) {
        console.error("getResourceExpenses | Error: " + ex);
        return { st: false, value: [] };
    }

    function createTable():ColDef[] {
        return [
           { field: "name", headerName: "Empresa", sortable: true, filter: true },
           { field: "timeSupplier", headerName: "Tempo de cadastro", sortable: true, filter: true,  cellRenderer: (params:{value:string}) => calcularTempoUso(params.value)},
           { field: "totalAmountInvested", headerName: "Total investido em recursos (R$)", sortable: true, filter: "agNumberColumnFilter", valueFormatter: (params) => `R$ ${params.value.toLocaleString("pt-BR")}` },
           { field: "evaluation", headerName: "Avaliação Geral", sortable: true, filter: true, cellRenderer: (params:string) => `${params}/10`},
           { field: "resource", headerName: "Tipo de investimento", sortable: true, filter: true, cellRenderer: (params:{value: {status:string}}) => {
                    if (params.value.status == "available") return "✅";
                    if (params.value.status == "in_use") return "Em uso";
                    if (params.value.status == "broken") return "Quebrado";
                    return "Perdido/Sem concerto"
               }},
            { field: "resource", headerName: "Valor (R$)", sortable: true, filter: "agNumberColumnFilter", valueFormatter: (params: { value: { value: number } }) => `R$ ${params.value.value.toLocaleString("pt-BR")}` },
           { field: "resource", headerName: "Investidor", sortable: true, filter: true, cellRenderer: (params:{value:{name:string}}) => params.value.name},
       ];
   }
}

export async function getAllBids(): Promise<GetBidsReturn> {
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'Bids',
                select: 'id, code, linkDoc, status, type, createAt, responseAt'
            })
        });

        return { st: true, value: await res.json(), table: createTable() };
    } catch (ex) {
        console.error("getAllBids | Error: " + ex);
        return { st: false, value: [] };
    }

    function createTable(): ColDef[] {
        return [
            { field: "id", headerName: "ID", sortable: true, filter: true},
            { field: "code", headerName: "Código", sortable: true, filter: true},
            { field: "linkDoc", headerName: "Documento", sortable: true, filter: true},
            {
                field: "status", headerName: "Status", sortable: true, filter: true, cellRenderer: (params: {value: string}) => {
                    if (params.value === "processing") return "Em Processamento";
                    if (params.value === "refused") return "Recusado";
                    if (params.value === "approved") return "Aprovado";
                    if (params.value === "review") return "Em Discusão";
                    if (params.value === "disputed") return "Disputado";
                    if (params.value === "resubmitted") return "Reenviado para correção";
                    return "Em Processamento";
                }
            },
            {
                field: "type", headerName: "Tipo", sortable: true, filter: true, cellRenderer: (params: {value: string}) => {
                    if (params.value === "purchase") return "Compra";
                    if (params.value === "rental") return "Aluguel";
                    if (params.value === "service") return "Serviço";
                    if (params.value === "resourceAllocation") return "Realocação de recurso";
                    if (params.value === "resource") return "Recurso";
                    if (params.value === "laboratory") return "Laboratórios/Oficinas";
                    return "Outros";
                }
            },
            { field: "createAt", headerName: "Homologado", sortable: true, filter: true, cellRenderer: (params: { value: string }) => calcularTempoUso(params.value) },
            { field: "responseAt", headerName: "Respondido", sortable: true, filter: true, cellRenderer: (params: { value: string }) => calcularTempoUso(params.value) },
        ];
    }
}  

export async function getFinanceDocs() { // : Promise<GetKpisReturn>
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                table: 'FinanceDoc',
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



