import { GetStaticProps, GetStaticPaths } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {DashboardLiderTeamPage, DashboardArtTeamPage} from "@/components/DashboardTeamPage"

import {NavDashBoard} from "@/components/NavDashBoard"
import {HeaderDashBoard} from "@/components/HeaderDashBoard"

import styles from '@/styles/pages/dashboard_teams.module.scss' 

// auths import 
import {useAuth} from "@/services/service.auth"

import {getTeamsByRootPage, getTeamDashboardComplete, getArtDashboardComplete} from "@/services/function.dashboard.team"
import {TeamDashboardComplete, ArtDashboardComplete, TeamsByRootPageProps} from "@/types/interfaceDashboardSql"
import {authMinifyProps, authProps} from "@/types/interfaceClass"

export default function DashboardResume({ nameTeam, idTeam, messages, dataAuth}: { messages: any, idTeam:string, nameTeam: string, dataAuth: authProps}){
    const router = useRouter();

    const [warning, setWarning] = useState({display: false, message: ""})

    const [team, setTeam] = useState<TeamDashboardComplete>()
    const [art, setArt] = useState<ArtDashboardComplete>()
    const [graphTeam , setGraphTeam] = useState({})

    const isLeader = () => ["leader", "allocatedLeader"].includes(dataAuth.user.role)
    
    const getPageReport = (reportType:string) => {    
        router.push({
            pathname: `/dashboard/${nameTeam}/report`,
            query: { res: reportType }
        }, undefined, { shallow: true });
    }

    const clickAction = (actionId : string, action: number) => {
        // TODO criar a função para click action
    }

    const sendQuarterlyReport = () => getPageReport("quarterly")
    const sendSemestralReport = () => getPageReport("semestral")
    const sendMonthlyReport = () => getPageReport("monthly")
    const sendBiweeklyReport = () => getPageReport("biweekly")
    
    const sendBid = () => router.push(`/dashboard/${nameTeam}/bid`)
    const sendArt = () => router.push(`/dashboard/${nameTeam}/art`)
    const requestMembers = () => {
        // TODO function, request member
    }

    const actions = {
        sendQuarterlyReport,
        sendSemestralReport,
        sendMonthlyReport,
        sendBiweeklyReport,
        requestMembers,
        sendBid,
        sendArt,
        clickAction
    }

    useEffect(() => {
        async function get(){
            const _useAuth = await useAuth()
            if(!dataAuth.auth){
                setWarning({display: true, message: "Erro ao autenticar o usuário"})
                return
            }

            const _userRole = dataAuth.user.role
            const _userAllocatedArt = dataAuth.user.allocatedArt

            if(_userRole == "leader"){
                const requestTeam = await getTeamDashboardComplete(idTeam || "0")
                if(!requestTeam.st){
                    setWarning({display: true, message: "Erro ao resgatar os dados da equipe"})
                    return
                }
                
                if (requestTeam.value && Array.isArray(requestTeam.value) === false) {
                    setTeam(requestTeam.value as TeamDashboardComplete);
                }
            }else{
                const requestArt = await getArtDashboardComplete(_userAllocatedArt)
                if(!requestArt.st){
                    setWarning({display: true, message: "Erro ao resgatar os dados da equipe"})
                    return
                }

                if (requestArt.value && Array.isArray(requestArt.value) === false) {
                    setArt(requestArt.value as unknown as ArtDashboardComplete);
                }
            }            
        }
        get()
    },[])
    
    return (
        <section className={styles.section}>
            <div className={styles.menuContent}>
                <NavDashBoard links={messages.links.links}/>
            </div>
            <div className={styles.paintContent}>
                <HeaderDashBoard imageUser={``} nameUser={``} nameTeam={nameTeam} key={"Header-Team-View"} warning={warning}/>
                <div className={styles.container}>
                    {
                        dataAuth.user?.role !== "leader" ? (
                            <DashboardArtTeamPage art={art} actions={actions}  isLeader={isLeader()} key={"Dashboard-Art"} />
                        ) : (
                            <DashboardLiderTeamPage team={team}  informationPages={{actions: actions, graphTeam: graphTeam}} key={"Dashboard-Lider"} />
                        )
                    }
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
    const _useAuth = await useAuth()

    if(!_useAuth.auth){
        return {
            redirect: {
                destination: '/403',
                permanent: false,
            },
        };
    }

    try {
        const acceptTeamsByThisId = await getTeamsByRootPage(_useAuth.user.id);
        const dataAuth = _useAuth

        if (!acceptTeamsByThisId.st) {
            return {
                notFound: true,
            };
        }

        const projects = acceptTeamsByThisId.value as TeamsByRootPageProps[];

        const project = projects.find(proj => proj.Team.name === nameTeam);

        if (!project) {
            return {
                redirect: {
                    destination: '/403',
                    permanent: false,
                },
            };
        }

        const messages = {
            links: await getTranslations("NavDashBoard", locale || "pt")
        };

        const idTeam = getIdProject(projects, nameTeam).Team.id

        return {
            props: { nameTeam, idTeam, messages, dataAuth},
            revalidate: 60,
        };
    } catch (error) {
        console.error("Erro ao obter os dados:", error);
        return {
            redirect: {
                destination: '/500',
                permanent: false,
            },
        };
    }


    function getIdProject(projects:TeamsByRootPageProps[], nameTeam:string){
        return projects.filter((team) => team.Team.name.toLocaleLowerCase() == nameTeam.toLocaleLowerCase())[0]
    }
};