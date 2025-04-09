import { GetStaticProps, GetStaticPaths } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import withAuth from '@/hoc/withAuth';
import {authUser, teamMemberByAuthuserProps} from "@/types/interfaceClass"

import {DashboardLiderTeamPage, DashboardArtTeamPage} from "@/components/DashboardTeamPage"

import {NavDashBoard} from "@/components/NavDashBoard"
import {HeaderDashBoard} from "@/components/HeaderDashBoard"

import styles from '@/styles/pages/dashboard_teams.module.scss' 

import {getTeamMember, getTeamDashboardComplete, getArtDashboardComplete} from "@/services/function.dashboard.team"
import {TeamDashboardComplete, ArtDashboardComplete, TeamsByRootPageProps} from "@/types/interfaceDashboardSql"

function ViewTeam({ nameTeam, messages, authUser}: { messages: any, nameTeam: string, authUser: authUser}){
    const router = useRouter();

    const [warning, setWarning] = useState({display: false, message: ""})

    const [team, setTeam] = useState<TeamDashboardComplete>()
    const [teamMember, setTeamMember] = useState<teamMemberByAuthuserProps>()
    const [art, setArt] = useState<ArtDashboardComplete>()
    const [graphTeam , setGraphTeam] = useState({})

    const isLeader = () => ["leader", "allocatedLeader"].includes((teamMember || {roleTeam: "member"}).roleTeam)
    
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
            if(!authUser.user.id){
                setWarning({display: true, message: "Erro ao autenticar o usuário"})
                return
            }

            const {team, teamMember} = await getTeamMember(authUser, nameTeam);

            if(!team && !teamMember){
                setWarning({display: true, message: "Erro ao autenticar o usuário"})
                return 
            }


            if(teamMember.roleTeam == "leader"){
                const requestTeam = await getTeamDashboardComplete(teamMember.teamId || "0")
                if(!requestTeam.st){
                    setWarning({display: true, message: "Erro ao resgatar os dados da equipe"})
                    return
                }
                
                if (requestTeam.value && Array.isArray(requestTeam.value) === false) {
                    setTeam(requestTeam.value as TeamDashboardComplete);
                }
            }else{
                const requestArt = await getArtDashboardComplete(teamMember.allocatedArt)
                if(!requestArt.st){
                    setWarning({display: true, message: "Erro ao resgatar os dados da equipe"})
                    return
                }

                if (requestArt.value && Array.isArray(requestArt.value) === false) {
                    setArt(requestArt.value as unknown as ArtDashboardComplete);
                }
            }          

            setTeamMember(teamMember)
        }
        get()
    },[])
    
    return (
        <section className={styles.section}>
            <div className={styles.menuContent}>
                <NavDashBoard links={messages.links.links}/>
            </div>
            <div className={styles.paintContent}>
                <HeaderDashBoard imageUser={authUser.user.image} nameUser={authUser.user.name} nameTeam={nameTeam} key={"Header-Team-View"} warning={warning}/>
                <div className={styles.container}>
                    {
                        (teamMember || {roleTeam: "member"}).roleTeam !== "leader" ? (
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
 
    const messages = {
        links: await getTranslations("NavDashBoard", locale || "pt")
    };

    return {
        props: { nameTeam, messages},
        revalidate: 60,
    };
};

export default withAuth(ViewTeam);
