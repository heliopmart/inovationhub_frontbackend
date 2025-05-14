import { GetStaticProps, GetStaticPaths } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import withAuth from '@/hoc/withAuth';
import {authUser} from "@/types/interfaceClass"

import {NavDashBoard} from "@/components/NavDashBoard"
import {HeaderDashBoard} from "@/components/HeaderDashBoard"

import {DefaultInput} from "@/components/Input"

import styles from '@/styles/pages/actionsTeam.module.scss' 

import {download_file} from "@/services/function.download.file"
import {getTeamViwer} from "@/services/function.dashboard.team"
import {DashboardInformationsProps} from "@/types/interfaceClass"

function DashboardInscription({ nameTeam, messages, authUser}: { messages: any, nameTeam: string, authUser: authUser}){
    const router = useRouter();
    const [information, setInformation] = useState<DashboardInformationsProps>()

    const [reportDoc, setReportDoc] = useState<any>()

    function sendInscription(){

    }

    useEffect(() => {
        async function get(){
            const requestInformations = await getTeamViwer()
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
                <HeaderDashBoard nameTeam={nameTeam} imageUser={authUser.user.image} nameUser={authUser.user.name} key={"header-dashboard-report"} />
                <div className={styles.container}>
                    <section className={styles.sectionContent}>
                        <span className={styles.TitleSection}>Equipe <b style={{color: information?.colorTeam}}>{nameTeam}</b></span>
                        <p className={styles.textContent}>
                            Baixe o documento usando o link abaixo do campo documento, preencha com todas as informações requisitadas pela equipe. Faça o upload e clique no botão laranja “Enviar”. <br/><br/>Sua inscrição será analisada pela equipe do projeto, você receberá o próximas instruções no seu e-mail.
                        </p>
                        <form className={styles.contentInputs}>
                            <DefaultInput minLength={1} placeholder="Documento" returnValue={(e) => setReportDoc(e)} text="Documento" type="file" value={reportDoc} key={"key-report-doc"}/>
                            <span onClick={() => download_file("inscription", "inscription/inscriptionDocTeam.docx")} className={styles.textDownloadDoc}>Baixar documento (WORD) de inscrição</span>
                            <button className={styles.buttonForm} title="Send" onClick={() => sendInscription()}>Enviar</button>
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

export default withAuth(DashboardInscription);