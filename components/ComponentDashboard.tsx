import style from "@/styles/components/ComponentDashboard.module.scss";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {download_file} from "@/services/function.download.file"

import {NormalizeRoleTeam, NormalizeType, NormalizeStatus, NormalizeStatusColor} from "@/lib/normalizeInformationToFront"
import {ComponentUsersToLeaderARTProps} from "@/types/interfaceClass"

type onClickAction = (actionId:string, action: number) => void

interface ComponentPropsART {
    status: string;
    type: string;
    observation: string;
    file: string;
    leader?: string;
    artNumber: string;
    onClick: onClickAction
}

interface ComponentPropsBids {
    internType: number
    bidsName: string,
    type: string,
    observation: string,
    status: string,
    file: string,
    onClick: onClickAction
}

interface ComponentPropsMember {
    dateInscriptionTeam: string,
    image: string
    finishedARTs: number,
    led: number,
    reportsDelivered: number,
    allocated: string,
    currentPosition: string,
    status: string,
    name: string,
    onClick: onClickAction
}

interface ComponentPropsInscriptionMember {
    name: string,
    image: string
    dateInscriptionHub: string,
    teamsParticipated: number,
    course: string,
    semester: string,
    inscriptionDocument: string,
    status: string,
    onClick: onClickAction
}

/*
    Status Txt: 

    await - Pendente
    approved - Aprovado
    rejected - Recusado
    suspended - Suspenso
    finalized - Finalizado
*/

/*
    internType: 
    0 - Requisição ART
    1 - Requisição da equipe
*/

/*
    Actions Numbers: 

    0 - Delete
    1 - Finalize
    2 - Approve
    3 - Suspend
    4 - Reject
    5 - Realocar Leader
    6 - Punish
    7 - Accept Member
    8 - Put on hold
*/

const setStatus: Record<"processing" | "approved" | "rejected" | "suspended" | "finalized", number> = {
    "processing": 0,
    "approved": 1,
    "rejected": 2,
    "suspended": 3,
    "finalized": 4,
}

async function downloadDoc(link: string) {
    await download_file("doc", link)
}

export function ComponentART({status, artNumber, file, leader, observation, type, onClick}: ComponentPropsART){
    return (
        <div className={style.componentContent}>
            <div className={style.contentHeader}>
                <span>Requisição de ART</span>  
                <div className={style.status} style={{backgroundColor: NormalizeStatusColor(status)}}/>
            </div>
            <div className={style.contentInformations}>
                <span>ART N°: <i>{artNumber}</i></span>
                <span>Tipo: <i>{NormalizeType(type)}</i></span>
                <span>Status: <i>{NormalizeStatus(status)}</i></span>
                <span>Observação: <i>{observation}</i></span>
                <span>Arquivo: <u onClick={() => downloadDoc(file)}>Baixar</u></span>
                <span>Líder Alocado: <i>{leader}</i></span>
            </div>
            <div className={style.contentActions}>
                {setStatus[status as keyof typeof setStatus] === 0 ? (
                    <>
                        <button onClick={() => onClick("art", 0)} className={style.buttonsActions}>Excluir ART</button>
                    </>
                ):(
                    <>
                        <button onClick={() => onClick("art",5)} className={style.buttonsActions}>Realocar Lider</button>
                        <button onClick={() => onClick("art",1)} className={style.buttonsActions}>Finalizar ART</button>
                        <button onClick={() => onClick("art",3)} className={style.buttonsActions}>Suspender</button>
                    </>
                )}
            </div>
        </div>
    )
}

export function ComponentBind({bidsName, file, internType, status, observation, type, onClick}:ComponentPropsBids){
    return (
        <div className={style.componentContent}>
            <div className={style.contentHeader}>
                <span>{internType ? "Requisição de Licitação lOCAL" : "Requisição de Licitação"}</span>
                <div className={style.status} style={{backgroundColor: NormalizeStatusColor(status)}}/>
            </div>
            <div className={style.contentInformations}>
                <span>Licitação N°: <i>{bidsName}</i></span>
                <span>Tipo: <i>{NormalizeType(type)}</i></span>
                <span>Status: <i>{NormalizeStatus(status)}</i></span>
                <span>Observação: <i>{observation}</i></span>
                <span>Arquivo: <u onClick={() => downloadDoc(file)}>Baixar</u></span>
            </div>
            <div className={style.contentActions}>
                {internType ? (
                    <>
                        <button onClick={() => onClick("bids",4)} className={style.buttonsActions}>Recusar</button>
                        <button onClick={() => onClick("bids", 2)} className={style.buttonsActions}>Aprovar</button>
                    </>
                ):(
                    <button onClick={() => onClick("bids", 0)} className={style.buttonsActions}>Excluir Licitação</button>
                )}
            </div>
        </div>
    )
}


export function ComponentMember({allocated, image, name, currentPosition, dateInscriptionTeam, finishedARTs, led, reportsDelivered, status, onClick}: ComponentPropsMember){
    return (
        <div className={style.componentContentMember}>
            <div className={style.status} style={{backgroundColor: NormalizeStatusColor(status)}}/>
            <img src={`${image}`} alt="" />
            <span className={style.titleNameUser}>{name}</span>
            <div className={style.contentInformations}>
                <span>Membro desde: <i>{dateInscriptionTeam}</i></span>
                <span>ARTs Finalizadas: <i>{finishedARTs}</i></span>
                <span>Liderou: <i>{led}</i></span>
                <span>Relatórios entregues: <i>{reportsDelivered}</i></span>
                <span>Alocado em: <i>{allocated}</i></span>
                <span>Cargo atual: <i>{NormalizeRoleTeam(currentPosition)}</i></span>
            </div>
            <div className={style.contentActions}>
                <button onClick={() => onClick("member", 6)} className={style.buttonsActions}>APLICAR PUNIÇÃO</button>
            </div>
        </div>
    )
}

export function ComponentInscription({course,dateInscriptionHub,image,inscriptionDocument,name,semester,status,teamsParticipated,onClick}: ComponentPropsInscriptionMember){
    return (
        <div className={style.componentContentMember}>
            <div className={style.status} style={{backgroundColor: NormalizeStatusColor(status)}}/>
            <img src={`${image}`} alt="" />
            <span className={style.titleNameUser}>{name}</span>
            <div className={style.contentInformations}>
                <span>Membro do hub desde: <i>{dateInscriptionHub}</i></span>
                <span>Equipes participante: <i>{teamsParticipated}</i></span>
                <span>Curso: <i>{course}</i></span>
                <span>Semestre: <i>{semester}</i></span>
                <span>documento de inscrição: <u onClick={() => downloadDoc(inscriptionDocument)}><i>Baixar</i></u></span>
            </div>
            <div className={style.contentActions}>
                <button onClick={() => onClick("inscription", 7)} className={style.buttonsActions}>Aceitar Membro</button>
                <button onClick={() => onClick("inscription", 8)} className={style.buttonsActions}>Colocar na lista de espera</button>
            </div>
        </div>
    )
}

export function ComponentUsersToLeaderART({data, downloadDoc, selectLeader} : ComponentUsersToLeaderARTProps){
    return (
        <>
            {
                data.length === 0 ? (
                    <div></div>
                ) : (
                    <div className={style.containerComponentUser}>
                        <Swiper
                            modules={[Pagination]}
                            spaceBetween={10}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                        >
                            {
                            data?.map((user, index) => (
                                <SwiperSlide key={`userToLeader-${index}`}>
                                    <label className={style.componentContent} >
                                        <div className={style.contentHeader}>
                                            <span><b>{user.name}</b></span>
                                            <input type="radio" name="select-leader" onChange={(e) => selectLeader(user.id)} />
                                        </div>
                                        <div className={style.contentInformations}>
                                            <span>Graduação: <i>{user.graduation[0]}</i></span>
                                            <span>Liderou: <i>{user.amountOfLeadership}</i></span>
                                            <span>ARTs Concluídas: <i>{user.finishedArts}</i></span>
                                            <span>Documento de inscrição: <u onClick={() => downloadDoc(user.linkDoc)}>Baixar</u></span>
                                        </div>
                                    </label>
                                </SwiperSlide>
                            ))
                        }
                        </Swiper>
                        
                    
                    </div>
                )
            }
        
        </>
    )
}