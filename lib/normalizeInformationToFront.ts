export const NormalizeRoleTeam = (inf:string) => {
    const n : { [key: string]: string }  = {
        "leader": "Líder",
        "allocatedLeader": "Lider Alocado",
        "member": "Membro",
        "coordinator": "Coordenador",
    }
    return n[inf] || ""
}

export const NormilizeTypeReport = (inf:string) => {
    const n: { [key: string]: string } = {
        "quarterly": "Trimestral",
        "semestral": "Semestral",
        "monthly": "Mensal",
        "biweekly": "Quinzenal"
    };

    return n[inf] || ""
}

export const NormalizeStatus = (inf:string) => {
    const n : { [key: string]: string }  = {
        "processing": "Processando",
        "review": "Revisado",
        "disputed": "Em disputa",
        "resubmitted": "Reenviado",
        "approved": "Aprovado",
        "refused": "Recusado",
        "finished": "Finalizado"
    }
    return n[inf] || ""
}

export const NormalizeStatusColor = (inf:string) => {
    const n : { [key: string]: string }  = {
        "processing": "#FFB800",
        "review": "#0b66dd",
        "disputed": "#a56c17",
        "resubmitted": "#1a1a1a",
        "approved": "#00B300",
        "refused": "#dd0b40",
        "finished": "#1a1a1a"
    }
    return n[inf] || ""
}


export const NormalizeType = (inf:string) => {
    const n : { [key: string]: string }  = {
        "purchase": "Compra",
        "rental": "Aluguel",
        "service": "Serviço",
        "resourceAllocation": "Alocação de recurso",
        "resource": "Recurso",
        "laboratory": "Laboratório",
        "other": "Outros",
        
        "modification": "Modificação",
        "creation": "Criação",
        "cancel": "Cancelamento",
        "interactive design": "Design Interativo",
    }
    return n[inf] || ""
}
