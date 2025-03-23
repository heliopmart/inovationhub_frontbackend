import { GetTeamCompleteReturn } from "@/types/interfacesSql"
import { ColDef } from 'ag-grid-community';

export async function getTeam(nameTeam: string): Promise<GetTeamCompleteReturn> {
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'Team',
                select: `id`,
                filter: [
                    {
                        column: 'name',
                        op: 'eq',
                        value: nameTeam
                    }
                ]
            })
        });

        const data = await getAllDataById((await res.json())[0].id)

        console.log(data)

        return { st: true, value: data[0], table: createTable() };
    } catch (ex) {
        console.error("function.index > getTeam | Error: " + ex);
        return { st: false, value: null };
    }

    function createTable(): ColDef[] {
        return [
            { field: "id", headerName: "ID", sortable: true, filter: true},
            { field: "name", headerName: "Nome", sortable: true, filter: true},
            { field: "value", headerName: "Valor (R$)", sortable: true, filter: "agNumberColumnFilter", valueFormatter: (params) => `R$ ${params.value ? params.value.toLocaleString("pt-BR") : "0,00"}` },
            {
                field: "status", headerName: "Status", sortable: true, filter: true, cellRenderer: (params: {value: string}) => {
                    if (params.value === "available") return "OK";
                    if (params.value === "in_use") return "Em uso";
                    if (params.value === "broken") return "Em manutenção antecipada";
                    if (params.value === "lost") return "Perdido";
                    return "Sem dados";
                }
            },
            { field: "user", headerName: "Responsável", sortable: true, filter: true, cellRenderer: (params: { value: {name: string} }) => params.value?.name },
        ];
    }
}

async function getAllDataById(id:string){
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
                members:TeamMember (
                        role,
                        roleTeam,
                        member:User (
                        id,
                        name,
                        color,
                        graduations,
                        image,
                        type,
                        socialMedia
                    )
                ),
                investors:TeamInvestor (
                        type,
                        investor:Investor (
                        id,
                        name,
                        type,
                        description,
                        image,
                        descriptionInvestment,
                        link,
                        color
                    )
                ),
                resources:TeamResource (
                    resource:Resource (
                        id,
                        name,
                        value,
                        status,
                        user:User (
                            name
                        )
                    )
                ),
                docs:TeamDocs (
                    name,
                    files:Doc (
                        name,
                        download
                    )
                ),
                arts:TeamArt (
                    files:Art (
                        type,
                        status,
                        linkDoc
                    )
                ),
                bids:TeamBids (
                    bid:Bids (
                        type,
                        status,
                        linkDoc
                    )
                ),
                contact: TeamContact(
                    role,
                    email
                )
                `,
            filter: [
                {
                    column: 'id',
                    op: 'eq',
                    value: id
                }
            ]
        })
    });

    return await res.json()
}


/*

[
    {
        "id": "1",
        "name": "MotoStudent",
        "image": "https://res.cloudinary.com/dvstrc0ni/image/upload/v1742673162/motostudent_cover_image_iejjgk.webp",
        "icon": "https://res.cloudinary.com/dvstrc0ni/image/upload/v1742673141/motostudent_icon_ts0iv0.svg",
        "description": "O <b>MotoStudent</b> é um projeto acadêmico de engenharia voltado para o desenvolvimento de <b>motocicletas de alta performance</b> para competições internacionais. <br/> Integrando conhecimentos de <i>engenharia mecânica, eletrônica e design automotivo</i>, a equipe projeta, fabrica e testa um protótipo funcional, aplicando inovação e pesquisa aplicada no setor de mobilidade. <br/><br/> O projeto faz parte do <b>Hub de Inovações da UFGD</b> e segue uma metodologia baseada em <b>KPIs (Key Performance Indicators)</b> para avaliar sua evolução. <br/> Os principais indicadores incluem o número de publicações científicas geradas, captação de recursos e patrocínios, desenvolvimento de novas tecnologias aplicadas ao setor automotivo e a empregabilidade dos membros da equipe após a participação no projeto. <br/><br/> Além do desenvolvimento técnico, o <b>MotoStudent</b> incentiva a interdisciplinaridade e a integração com empresas e startups, promovendo o espírito empreendedor e a inovação na engenharia nacional. <br/> O projeto prepara os participantes para desafios reais da indústria e reforça a posição da <b>UFGD</b> no cenário global de competições acadêmicas.",
        "color": "#C71037",
        "createAt": "2025-03-22 19:03:38.335857+00",
        "description_innovation": "Desenvolvendo propulsão",
        "status": "operation",
        "totalInvestmentAllocated": 10000,
        "members": [
            {
                "role": "founder",
                "member": {
                    "id": "1",
                    "name": "João Silva",
                    "type": "docente",
                    "color": "#FF5733",
                    "image": "joao.png",
                    "graduations": [
                        "Engenharia Mecânica",
                        "3º Semestre"
                    ]
                }
            },
            {
                "role": "member",
                "member": {
                    "id": "2",
                    "name": "Maria Souza",
                    "type": "docente",
                    "color": "#3399FF",
                    "image": "maria.png",
                    "graduations": [
                        "Engenharia de Produção",
                        "3º Semestre"
                    ]
                }
            }
        ],
        "investors": [],
        "resources": [
            {
                "resource": {
                    "id": "res-1",
                    "name": "Furadeira Bosch",
                    "user": {
                        "name": "Maria Souza"
                    },
                    "value": 500,
                    "status": "available"
                }
            }
        ]
    }
]
*/