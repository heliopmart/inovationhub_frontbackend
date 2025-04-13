import {InputFilter} from "@/components/InputFilter"
import {ComponentART, ComponentBind, ComponentMember, ComponentInscription} from "@/components/ComponentDashboard"
import {DynamicTable} from "@/components/DynamicTable"
import {TeamDashboardComplete, Resource, ArtDashboardComplete} from "@/types/interfaceDashboardSql"
import Link from "next/link"
import {ColDef } from 'ag-grid-community';
import {useState} from "react"
import {download_file} from "@/services/function.download.file"

import style from "@/styles/components/DashboardTeamPage.module.scss"

import {NormalizeType, NormalizeStatus} from "@/lib/normalizeInformationToFront"

interface ArtTeamPage{
    isLeader?: boolean,
    art?: ArtDashboardComplete,
    actions: {
        sendMonthlyReport: () => void,
        sendBiweeklyReport: () => void,
        sendQuarterlyReport?: () => void,
        sendSemestralReport?: () => void,
        sendBid: () => void,
        requestMembers: () => void
        clickAction: (actionId: string, action: number) => void
    },
}

interface LiderTeamPage{
    team?: TeamDashboardComplete,
    informationPages: {
        graphTeam:{
            
        },
        actions: {
            sendQuarterlyReport: () => void,
            sendSemestralReport: () => void,
            sendMonthlyReport?: () => void,
            sendBiweeklyReport?: () => void,
            requestMembers?: () => void
            sendBid: () => void,
            sendArt: () => void
            clickAction: (actionId: string, action: number) => void
        },
    }
}

const calcularTempoUso = (date: string) => {

    const ConvertDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - ConvertDate.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return `${diffYears} anos e ${diffMonths} meses`;
};

const tableColumn: ColDef[] = [
    { field: "name", headerName: "Recurso", sortable: true, filter: true, cellRenderer: (params: { data: { resource : Resource} }) => params.data.resource.name},
    { field: "value", headerName: "Valor (R$)", sortable: true, filter: "agNumberColumnFilter", valueFormatter: (params: { data: { resource : Resource} }) => `R$ ${params.data.resource.value.toLocaleString("pt-BR")}` },
    { field: "purchase", headerName: "Data de Compra", sortable: true, filter: true, cellRenderer: (params:  { data: { resource : Resource} }) => calcularTempoUso(params.data.resource.purchase)  },
    { field: "timeUse", headerName: "Tempo de Uso", sortable: true, filter: true, cellRenderer: (params: { data: { resource : Resource} }) => calcularTempoUso(params.data.resource.timeUse) },
    { field: "status", headerName: "Status", sortable: true, filter: true, cellRenderer: (params: { data: { resource : Resource} }) => {
        if (params.data.resource.status == "available") return "✅";
        if (params.data.resource.status == "in_use") return "Em uso";
        if (params.data.resource.status == "broken") return "Quebrado";
        return "Perdido/Sem concerto"
    }},
    {
        field: "attention", headerName: "Atenção", sortable: true, filter: true, cellRenderer: (params: { data: { resource : Resource} }) => {
            if (params.data.resource.attention === true) return "⚠️";
            if (params.data.resource.attention === false) return "✅";
            return "✅";
        }
    },
    { field: "attentionDescription", headerName: "Obsevação", sortable: true, filter: true,  cellRenderer: (params: { data: { resource : Resource} }) => params.data.resource.attentionDescription },
    { field: "serialNumber", headerName: "Número de Série", sortable: true, filter: true,  cellRenderer: (params: { data: { resource : Resource} }) => params.data.resource.serialNumber },
    { field: "lastMaintenance", headerName: "Última Manutenção", sortable: true, filter: true, cellRenderer: (params: { data: { resource : Resource} }) => calcularTempoUso(params.data.resource.lastMaintenance) },
    { field: "nextMaintenance", headerName: "Próxima Manutenção", sortable: true, filter: true, cellRenderer: (params: { data: { resource : Resource} }) => calcularTempoUso(params.data.resource.nextMaintenance) },
    { field: "updateAt", headerName: "Última Atualização", sortable: true, filter: true, cellRenderer: (params: { data: { resource : Resource} }) => calcularTempoUso(params.data.resource.updateAt) },
];

const filterArtOptions = [
    "Todas as ARTs",
    "ARTs Aprovadas", 
    "ARTs Pendentes" 
]

const filterBidsOptions = [
    "Todos as licitações",
    "Compra", 
    "Aluguel",
    "Serviço",
    "Alocação de recurso do Hub",
    "Recurso",
    "Laboratórios",
    "Outros" 
]

const filterMemberOptions = [
    "Todos",
    "Fundadores", 
    "Lideres Alocados", 
    "Membros", 
    "Membros Alocados",
    "Coordenadores"
]

export function DashboardLiderTeamPage({team, informationPages}: LiderTeamPage){

    const [filterArt, setFilterArt] = useState<string>("0") 
    const [filterLocalBids, setFilterLocalBids] = useState<string>("0") 
    const [filterBids, setFilterBids] = useState<string>("0") 
    const [filterMembers, setFilterMembers] = useState<string>("0") 

    const getInvestorAndInvestment = () => {
        return team?.investorInvestments.map((investment) => {
            return {
                value: investment.value,
                nameInvestor: investment.investor.name
            }
        })
        // TODO: Pode ser que exista mais investimentos com o mesmo Investidor, isso deve ser normalizado e somado em um unico só
    }

    const showArtsByFilter = () => {
        const typeFilter = ["all", "approved", "processing", "refused", "review", "disputed", "resubmitted"]
        const normalizeFilter = typeFilter[parseInt(filterArt)]
        const _arts = team?.teamArts

        if(normalizeFilter == "all"){
            return _arts
        }

        return (_arts?.filter((art) => (art.art.status === normalizeFilter)))
    }

    const showLocalBidsByFilter = () => {
        const typeFilter = ["all", "purchase", "rental", "service", "resourceAllocation", "resource", "laboratory", "other"]
        const staticFilter = ["processing", "review", "disputed", "resubmitted"]
        const normalizeFilter = typeFilter[parseInt(filterLocalBids)]
        const _bids = team?.teamBids

        if(normalizeFilter == "all"){
            return (_bids?.filter((bid) => (staticFilter.includes(bid.bid.status))))
        }

        return (_bids?.filter((bid) => (bid.bid.type === normalizeFilter) && (staticFilter.includes(bid.bid.status) )))
    }

    const showBidsByFilter = () => {
        const typeFilter = ["all", "purchase", "rental", "service", "resourceAllocation", "resource", "laboratory", "other"]
        const staticFilter = ["processing", "review", "disputed", "resubmitted"]
        const normalizeFilter = typeFilter[parseInt(filterLocalBids)]
        const _bids = team?.teamBids

        if(normalizeFilter == "all"){
            return (_bids?.filter((bid) => (staticFilter.includes(bid.bid.status) && (bid.artId == "" || undefined || null))))
        }

        return (_bids?.filter((bid) => (bid.bid.type === normalizeFilter) && (staticFilter.includes(bid.bid.status)) && (bid.artId == "" || undefined || null)))
    }

    const showMembersByFilter = () => {
        const typeFilter = ["all", "founder", "allocatedLeader", "member", "allocatedMembers", "coordinators"]
        const normalizeFilter = typeFilter[parseInt(filterMembers)]
        const _members = team?.teamMembers

        if(normalizeFilter == "all"){
            return _members
        }

        return (_members?.filter((member) => member.roleTeam === normalizeFilter))
    }

    const showResorcesTable = () => {
        return team?.teamResources
    }
    return (
        <>
            <section className={style.sectionContent}>
                <span className={style.TitleSection}>Equipe <b style={{color: team?.color, fontWeight: "bold"}}>{team?.name}</b></span>
                <div className={style.contentValues}>
                    <div className={style.contentValuesItem} style={{backgroundColor: "#5487CA"}}>
                        <span className={style.title}>Valor disponível:</span>
                        <span className={style.value}><b>R$ {(team?.totalValueAllocated ?? 0) - (team?.totalInvestmentAllocated ?? 0)}</b></span>
                    </div>
                    <div className={style.contentValuesItem} style={{backgroundColor: "#839C66"}}>
                        <span className={style.title}>Valor Alocado: </span>
                        <span className={style.value}><b>R$ {team?.totalValueAllocated}</b></span>
                    </div>
                    <div className={style.contentValuesItem} style={{backgroundColor: "#AE5F5F"}}>
                        <span className={style.title}>Investimento Total: </span>
                        <span className={style.value}><b>R$ {team?.totalInvestmentAllocated}</b></span>
                    </div>
                </div>
                <div className={style.contentInformation}>
                    <div className={style.graph} data-title="Gráficos de kpi">
                        {/* gráfico */}
                    </div>
                    <div className={style.investor} data-title="investidores">
                        {getInvestorAndInvestment()?.map((investor, index) => ( 
                            <span className={style.textInvestor} key={`key-insvestor-${index}`}>{investor.nameInvestor} | R$ {investor.value}</span>
                        ))}
                    </div>
                </div>
                <div className={style.contentActions}>
                    <button className={style.buttonsAction} style={{backgroundColor: "#129759"}} onClick={informationPages.actions.sendQuarterlyReport}>Enviar Relatório Trimestral</button>
                    <button className={style.buttonsAction} style={{backgroundColor: "#474747"}} onClick={informationPages.actions.sendSemestralReport}>Enviar Relatório Semestral</button>
                    <button className={style.buttonsAction} style={{backgroundColor: "#865E26"}} onClick={informationPages.actions.sendBid}>Enviar Licitação</button>
                    <button className={style.buttonsAction} style={{backgroundColor: "#FF7327"}} onClick={informationPages.actions.sendArt}>Enviar ART</button>
                </div>
            </section>
            <section className={style.sectionContent}>
                <div className={style.contentHeaderSection}>
                    <span className={style.TitleSection}>{"ARTs"}</span>
                    <button  onClick={informationPages.actions.sendArt} className={style.button} title={"Send ART"}>{"Enviar uma ART"}</button>
                </div>
                <InputFilter onChange={(e) => setFilterArt(e.target.value)} value={filterArt} options={filterArtOptions} placeholder="Filter" key={"input-filter-arts"} />

                <div className={style.contentFlex}>
                    {
                        showArtsByFilter()?.map((art, index) => (
                            <ComponentART artNumber={art.art.name} file={art.art.linkDoc} leader={art.leaderName} observation={art.art.observation} onClick={informationPages.actions.clickAction} status={(art.art.status)} type={(art.art.type)} key={`key-ART-${index}`}/>
                        ))
                    }
                </div>
            </section>
            <section className={style.sectionContent}>
                <span className={style.TitleSection}>{"LICITAÇÕES DOS LIDERES ALOCADOS"}</span>
                <InputFilter onChange={(e) => setFilterLocalBids(e.target.value)} value={filterLocalBids} options={filterBidsOptions} placeholder="Filtrar" key={"input-filter-bids"} />

                <div className={style.contentFlex}>
                    {
                        showLocalBidsByFilter()?.map((localBid, index) => (
                            <ComponentBind bidsName={localBid.bid.code} file={localBid.bid.linkDoc} internType={1} observation={``} onClick={informationPages.actions.clickAction} status={(localBid.bid.status)} type={(localBid.bid.type)} key={`key-local-bids-${index}`}/>
                        ))
                    }
                </div>
            </section>
            <section className={style.sectionContent}>
                <div className={style.contentHeaderSection}>
                    <span className={style.TitleSection}>{"LICITAÇÕES DO PROJETO"}</span>
                    <button onClick={informationPages.actions.sendBid} className={style.button} style={{backgroundColor: "#865E26"}} title={""}>{"Enviar uma LICITAÇÃO"}</button>
                </div>
                <InputFilter onChange={(e) => setFilterBids(e.target.value)} value={filterBids} options={filterBidsOptions} placeholder="Filtrar" key={"input-filter-ProjectBids"} />

                <div className={style.contentFlex}>
                    {
                        showBidsByFilter()?.map((localBid, index) => (
                            <ComponentBind bidsName={localBid.bid.code} file={localBid.bid.linkDoc} internType={1} observation={``} onClick={informationPages.actions.clickAction} status={(localBid.bid.status)} type={(localBid.bid.type)} key={`key-bids-${index}`}/>
                        ))
                    }
                </div>
            </section>
            <section className={style.sectionContent} style={{border: 'none'}}>
                <span className={style.TitleSection}>{"GERENCIAR MEMBROS"}</span>
                <InputFilter onChange={(e) => setFilterMembers(e.target.value)} value={filterMembers} options={filterMemberOptions} placeholder="Filtrar" key={"input-filter-members"} />

                <div className={style.contentFlex}>

                    {
                        showMembersByFilter()?.map((member, index) => (
                            <ComponentMember allocated={member.allocatedArt} currentPosition={(member.roleTeam)} dateInscriptionTeam={member.createAt} finishedARTs={member.user.finishedArts} led={member.user.amountOfLeadership} onClick={informationPages.actions.clickAction} image={member.user.image} name={member.user.name} reportsDelivered={member.user.reportsDelivered} status="approved" key={`key-member-approved-${index}`}/>
                        ))
                    }                    
                </div>
            </section>
            <section className={style.sectionContent}>
                <span className={style.TitleSection}>{"NOVAS INSCRIÇÕES"}</span>

                <div className={style.contentFlex}>
                    {
                        team?.teamInscriptions?.map((member, index) => (
                            <ComponentInscription course={member.user.graduations[0]} dateInscriptionHub={member.user.createAt} image={member.user.image} inscriptionDocument={member.document} name={member.user.name} onClick={informationPages.actions.clickAction} semester={member.user.graduations[1]} status="processing" teamsParticipated={member.user.participatingTeams} key={`key-member-approved-${index}`}/>
                        ))
                    }   
                    
                </div>
            </section>
            <section className={style.sectionContent}>
                <span className={style.TitleSection}>{"Recursos alocados para a equipe"}</span>    
                <DynamicTable columnDefs={tableColumn} title="" p="" rowData={showResorcesTable() || []} key={"table-resorces-team"} noText={true}/>
            </section>

        </>
    )
}

export function DashboardArtTeamPage({actions, art, isLeader}: ArtTeamPage){
    
    const [filterBids, setFilterBids] = useState<string>("0") 
    const [filterMembers, setFilterMembers] = useState<string>("0") 
    
    const showBidsByFilter = () => {
        const typeFilter = ["all", "purchase", "rental", "service", "resourceAllocation", "resource", "laboratory", "other"]
        const staticFilter = ["processing", "review", "disputed", "resubmitted"]
        const normalizeFilter = typeFilter[parseInt(filterBids)]
        const _bids = art?.teamBids

        if(normalizeFilter == "all"){
            return (_bids?.filter((bid) => (staticFilter.includes(bid.bid.status))))
        }

        return (_bids?.filter((bid) => (bid.bid.type === normalizeFilter) && (staticFilter.includes(bid.bid.status))))
    }

    const showMembersByFilter = () => {
        const typeFilter = ["all", "founder", "allocatedLeader", "member", "allocatedMembers", "coordinators"]
        const normalizeFilter = typeFilter[parseInt(filterMembers)]
        const _members = art?.teamMembers

        if(normalizeFilter == "all"){
            return _members
        }

        return (_members?.filter((member) => member.roleTeam === normalizeFilter))
    }

    const showResorcesTable = () => {
        return art?.teamArts[0].team.teamResources
    }

    return (
        <>
            <section className={style.sectionContent}>
                <span className={style.TitleSection}>Equipe <b style={{color: art?.teamArts[0]?.team?.color}}>{art?.teamArts[0]?.team?.name}</b></span>
                <div className={style.contentValues}>
                    <div className={style.contentValuesItem} style={{backgroundColor: "#5487CA"}}>
                        <span className={style.title}>Valor disponível:</span>
                        <span className={style.value}><b>R$ {(art?.totalValueAllocated ?? 0) - (art?.totalInvestmentAllocated ?? 0)}</b></span>
                    </div>
                    <div className={style.contentValuesItem} style={{backgroundColor: "#839C66"}}>
                        <span className={style.title}>Valor Alocado: </span>
                        <span className={style.value}><b>R$ {art?.totalValueAllocated}</b></span>
                    </div>
                    <div className={style.contentValuesItem} style={{backgroundColor: "#AE5F5F"}}>
                        <span className={style.title}>Investimento Total: </span>
                        <span className={style.value}><b>R$ {art?.totalInvestmentAllocated}</b></span>
                    </div>
                </div>
                <div className={style.contentInformationArt}>
                    <span className={style.TitleSection}>{"Informações da ART"}</span>
                    <div className={style.contentInformation}>
                        <span>ART Nº <i>{art?.name}</i></span>
                        <span>Status: <i>{NormalizeStatus(art?.status || "")}</i></span>
                        <span>Tipo: <i>{NormalizeType(art?.type || "")}</i></span>
                        <span>Lider da ART: <i>{""}</i></span>
                        <span>Documento: <span className={style.OnClickSpan} onClick={(e) => download_file("art", art?.linkDoc || "")}><i>Baixar</i></span></span>
                        <span>Data limite da implementação: <i>{art?.limitDate}</i></span>
                    </div>
                </div>
                <div className={style.contentActions}>
                    <button className={style.buttonsAction} style={{backgroundColor: "#129759"}} onClick={actions.sendMonthlyReport}>Enviar Relatório Mensal</button>
                    <button className={style.buttonsAction} style={{backgroundColor: "#474747"}} onClick={actions.sendBiweeklyReport}>Enviar Relatório Quinzenal</button>
                    {isLeader ? (<button className={style.buttonsAction} style={{backgroundColor: "#865E26"}} onClick={actions.sendBid}>Enviar Licitação</button>) : ""}
                    {isLeader ? (<button className={style.buttonsAction} style={{backgroundColor: "#4062EA"}} onClick={actions.requestMembers}>Solicitar Memebros</button>) : ""}
                    
                </div>
            </section>
            <section className={style.sectionContent}>
                <div className={style.contentHeaderSection}>
                    <span className={style.TitleSection}>{"LICITAÇÕES DA ART"}</span>
                    {isLeader ? (<button onClick={actions.sendBid} className={style.button} style={{backgroundColor: "#865E26"}} title={"Send Bids"}>{"Enviar uma LICITAÇÃO"}</button>) : ""}
                </div>
                <InputFilter onChange={(e) => setFilterBids(e.target.value)} value={filterBids} options={filterBidsOptions} placeholder="Filtrar" key={"input-filter-ProjectBids"} />

                <div className={style.contentFlex}>
                    {
                        showBidsByFilter()?.map((bid, index) => (
                            <ComponentBind bidsName={bid.bid.code} file={bid.bid.linkDoc} internType={0} observation={""} onClick={actions.clickAction} status={(bid.bid.status)} type={(bid.bid.type)} key={`key-bids-${index}`}/>
                        ))
                    }
                </div>
            </section>
            <section className={style.sectionContent} style={{border: 'none'}}>
                <div className={style.contentHeaderSection}>
                    <span className={style.TitleSection}>{"Membros da ART"}</span>
                    {isLeader ? (<button onClick={actions.requestMembers} className={style.button} style={{backgroundColor: "#4062EA"}} title={"Request Member"}>{"Solicitar Membros"}</button>) : ""}
                </div>
                <InputFilter onChange={(e) => (setFilterMembers(e.target.value))} value={filterMembers} options={filterMemberOptions} placeholder="Filtrar" key={"input-filter-members"} />

                <div className={style.contentFlex}>
                    {
                        showMembersByFilter()?.map((member, index) => (
                            <ComponentMember allocated={art?.name || ""} currentPosition={(member.roleTeam)} dateInscriptionTeam={member.createAt} finishedARTs={member.user.finishedArts} led={member.user.amountOfLeadership} onClick={actions.clickAction} image={member.user.image} name={member.user.name} reportsDelivered={member.user.reportsDelivered} status="approved" key={`key-member-approved-${index}`}/>

                        ))
                    }
                </div>
            </section>
            <section className={style.sectionContent}>
                <span className={style.TitleSection}>{"Recursos alocados para a equipe"}</span>
                <DynamicTable columnDefs={tableColumn} title="" p="" rowData={showResorcesTable() || []} key={"table-resorces-team"} noText={true}/>
            </section>

        </>
    )
}