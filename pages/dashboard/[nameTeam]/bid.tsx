import { GetStaticProps, GetStaticPaths } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import withAuth from '@/hoc/withAuth';
import {authUser} from "@/types/interfaceClass"

import {NavDashBoard} from "@/components/NavDashBoard"
import {HeaderDashBoard} from "@/components/HeaderDashBoard"

import {SelectInput, FileInput} from "@/components/Input"

import styles from '@/styles/pages/actionsTeam.module.scss' 

import {NormalizeType, InverseNormalizeType} from "@/lib/normalizeInformationToFront"
import {getUserInformations, callCreateBid} from "@/services/function.create.bid"
import {getTeamMember} from "@/services/function.dashboard.team"
import { ArtTeamProps } from "@/types/interfaceDashboardSql"

interface TeamInformationsProps{
    id: string,
    name:string,
    color: string
    roleTeam: string
    artId?: string
}

const types = ["purchase", "rental", "service", "resourceAllocation", "resource", "laboratory", "other"]

function DashboardBid({ nameTeam, messages, authUser }: { messages: any, nameTeam: string, authUser: authUser}){
    const router = useRouter();
    
    const [information, setInformation] = useState<TeamInformationsProps>()
    const [artsName, setArtsName] = useState<string[]>([])
    const [arts, setArts] = useState<ArtTeamProps[]>([])

    const [bidType, setBidType] = useState<string>("")
    const [bidDoc, setBidDoc] = useState<any>()
    const [bidArt, setBidArt] = useState<string>("")

    const artId = () => {
        if(information?.roleTeam == 'leader'){
            return arts.filter((v) => v.name == bidArt)[0].id
        }else{
            return information?.artId
        }
    }

    async function sendBid(){
        if(!bidType || !bidDoc || !bidArt) return

        const data = {
            teamId: information?.id,
            type: InverseNormalizeType(bidType),
            artId: artId(),
            file: bidDoc,
            userId: authUser.user.id,
        }

        const request = await callCreateBid(data, information?.id as string)
        if(request){
            alert("Licitação criada com sucesso")
            router.push(`/dashboard/team/${nameTeam}`)
        }else{
            alert("Erro ao criar Licitação")
        }
    }

    useEffect(() => {
        async function get(){
            const {team, teamMember} = await getTeamMember(authUser, nameTeam);
            
            if(teamMember.roleTeam == 'leader'){
                const requestArts = await getUserInformations(teamMember.teamId);
                console.log(requestArts.value)
                if(requestArts.st){
                    setArtsName(requestArts.value.map((v) => v.name))
                    setArts(requestArts.value)
                }
            }else{
                setArtsName(["Minha Art"])
            }

            setInformation({...team, roleTeam: teamMember.roleTeam, artId: teamMember.allocatedArt} as TeamInformationsProps)
        }
        get()
    },[])

    return (
        <section className={styles.section}>
            <div className={styles.menuContent}>
                <NavDashBoard links={messages.links.links}/>
            </div>
            <div className={styles.paintContent}>
                <HeaderDashBoard nameTeam={nameTeam} imageUser={authUser.user.image} nameUser={authUser.user.name} key={"header-dashboard-bid"} />
                <div className={styles.container}>
                    <section className={styles.sectionContent}>
                        <span className={styles.TitleSection}>Equipe <b style={{color: information?.color}}>{nameTeam}</b></span>
                        <span className={styles.titleContent}>Requisição de Licitação {information?.roleTeam == 'leader' || 'coordinator' ? "" : "| ART"}</span>
                        
                        <form className={styles.contentInputs}>
                            <SelectInput courses={types.map((v) => NormalizeType(v))} returnValue={(e) => {setBidType(e)}} text="Tipo de licitação" value={bidType} key={"key-bid-type"}/>
                            <FileInput returnValue={(e) => {setBidDoc(e)}} text="Documento" key={"key-bid-doc"}/>
                            <SelectInput courses={artsName} returnValue={(e) => {setBidArt(e)}} text="Beneficiário" value={bidArt} key={"key-bid-art"}/>
                            <button className={styles.buttonForm} title="Send" type="button" onClick={() => {sendBid()}}>Enviar</button>
                        </form>
                    </section>
                </div>
            </div>
        </section>
    )
}


export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [{ params: { nameTeam: "default" } }],
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
    const nameTeam = params?.nameTeam as string;

    const messages = {
        links: await getTranslations("NavDashBoard", locale || "pt")
    };

    return {
        props: { nameTeam, messages},
        revalidate: 60,
    };
};

export default withAuth(DashboardBid);