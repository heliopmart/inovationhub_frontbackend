import { GetStaticProps } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import withAuth from '@/hoc/withAuth';
import {authUser} from "@/types/interfaceClass"

import {NavDashBoard} from "@/components/NavDashBoard"
import {HeaderDashBoard} from "@/components/HeaderDashBoard"

import {MyTeam, OthersTeam} from "@/components/TeamDashboard"

import styles from '@/styles/pages/dashboard_teams.module.scss' 

import {getTeams} from "@/services/function.dashboard.team"
import { TeamsWithTeamMemberProps } from "@/types/interfaceDashboardSql";



function getOnlyMyTeams(Teams:TeamsWithTeamMemberProps[], userId: string){
    return Teams.filter((team) => team.teamMember.length > 0 && team.teamMember.filter(member => member.memberId == userId));
}

function getWithoutMyTeams(Teams:TeamsWithTeamMemberProps[]){
    return Teams.filter((team) => team.teamMember.length == 0);
}


function DashBoardTeam({messages, authUser}: { messages: any,  authUser: authUser}){
    const { locale } = useRouter();
    const [loading, setLoading] = useState(true);
    const [warning, setWarning] = useState({display: false, message: ""});
    const [myTeam, setMyTeam] = useState<TeamsWithTeamMemberProps[]>([]);
    const [othersTeam, setOthersTeam] = useState<TeamsWithTeamMemberProps[]>([]);
    
    useEffect(() => {
        async function get(){
            setLoading(true);
            const returnTeams = await getTeams(authUser.user.id);
            
            if(!returnTeams.st)
                setWarning({display: true, message: "Tivermos um erro ao carregar as equipe."});
            
            setMyTeam(getOnlyMyTeams(returnTeams.value, authUser.user.id))
            setOthersTeam(getWithoutMyTeams(returnTeams.value))

            setLoading(false);
        }
        get();
    }, []);
    
    return (
        <section className={styles.section}>
            <div className={styles.menuContent}>
                <NavDashBoard links={messages.links.links}/>
            </div>
            <div className={styles.paintContent}>
                <HeaderDashBoard nameUser={authUser.user.name} imageUser={authUser.user.image} key={"Header-Team-Dashboard"}/>
                <div className={styles.container}>
                    <section className={styles.sectionContent}>
                        <div className={styles.contentHeaderSection}>
                            <span className={styles.TitleSection}>{messages.messages.sectionMyTeam}</span>
                            <button className={styles.button} title={messages.messages.buttonCreateTeam}>{messages.messages.buttonCreateTeam}</button>
                        </div>


                        <div className={styles.contentTeams}>
                            {
                                myTeam?.map((team, index) => (
                                    <MyTeam key={`${index}-myteam`} color={team.color} description={team.description.split("<br/><br/>")[0]} name={team.name} teamIdName={team.name}/>
                                ))
                            }

                        </div>
                    </section>
                    <section className={styles.sectionContent}>
                        <span className={styles.TitleSection}>{messages.messages.sectionOthersTeam}</span>
                        
                        <div className={styles.contentTeams}>
                            {
                                othersTeam?.map((team, index) => (
                                    <OthersTeam key={`${index}-othersTeam`} color={team.color} description={team.description.split("<br/><br/>")[0]} name={team.name} teamIdName={team.name}/>
                                ))
                            }
                        </div>
                    </section>
                    
                </div>
            </div>
        </section>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = {
        messages: await getTranslations("dashboardTeams", locale || "pt"),
        links: await getTranslations("NavDashBoard", locale || "pt")
    }

    return {
        props: { messages },
    };
};


export default withAuth(DashBoardTeam);