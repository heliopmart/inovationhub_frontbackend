import { GetStaticProps, GetStaticPaths } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import withAuth from '@/hoc/withAuth';
import {authUser} from "@/types/interfaceClass"

import {NavDashBoard} from "@/components/NavDashBoard"
import {HeaderDashBoard} from "@/components/HeaderDashBoard"

import {ComponentUsersToLeaderART} from "@/components/ComponentDashboard"
import {DefaultInput, SelectInput} from "@/components/Input"

import styleLoading from '@/styles/components/Loading.module.scss'
import styles from '@/styles/pages/actionsTeam.module.scss' 

import {getTeamViwer} from "@/services/function.dashboard.team"
import {DashboardInformationsProps} from "@/types/interfaceClass"

function DashboardArt({ nameTeam, messages, authUser }: { messages: any, nameTeam: string, authUser: authUser}){
    const router = useRouter();
    const [information, setInformation] = useState<DashboardInformationsProps>()
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        async function get(){
            setLoading(true)
            const requestInformations = await getTeamViwer()

            if(requestInformations?.roleTeam !== "leader" || requestInformations?.roleTeam !== "coordinator"){
                router.push("/dashboard/team")
            }
            setLoading(false)

            setInformation(requestInformations)
        }
        get()
    },[])
    return (
        <section className={styles.section}>
            <div className={styles.menuContent}>
                <NavDashBoard links={messages.links.links}/>
            </div>
            <div className={styles.paintContent}>
                <HeaderDashBoard nameTeam={nameTeam}/>
                <div className={styles.container}>
                    <section className={styles.sectionContent}>
                        <span className={styles.TitleSection}>Equipe <b style={{color: information?.colorTeam}}>{nameTeam}</b></span>
                        
                        {
                            loading ? (
                                <div className={styleLoading.containerLoading}>
                                    <span>Authenticando Usuário</span>
                                </div>
                            ) : (
                                <>
                                    <span className={styles.titleContent}>Requisição de ART</span>
                        
                                    <form className={styles.contentInputs}>
                                        <DefaultInput minLength={10} placeholder="Nome da ART" returnValue={(e) => {}} text="Nome da ART" type="text" value={""} key={"key-art-name"}/>
                                        <SelectInput courses={["Compra"]} returnValue={(e) => {}} text="Tipo de ART" value={""} key={"key-report-type"}/>
                                        <DefaultInput minLength={1} placeholder="Documento" returnValue={(e) => {}} text="Documento" type="file" value={""} key={"key-art-doc"}/>
                                        <SelectInput courses={[""]} returnValue={(e) => {}} text="Coordenador Alocado" value={""} key={"key-art-coordinator"}/>
                                        
                                        <div className={styles.contentUserToLeader}>
                                            <DefaultInput minLength={10} placeholder="Pesquisar" returnValue={(e) => {}} text="Lider Alocado" type="text" value={""} key={"key-art-leader"}/>
                                            <ComponentUsersToLeaderART/>
                                        </div>
                                        
                                        <DefaultInput minLength={1} placeholder="Data limite para implementação" returnValue={(e) => {}} text="Data limite para implementação" type="date" value={""} key={"key-art-date"}/>
                                        
                                        <button className={styles.buttonForm} title="Send" onClick={() => {}}>Enviar</button>
                                    </form>
                                </>
                            )
                        }

                        
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

export default withAuth(DashboardArt);