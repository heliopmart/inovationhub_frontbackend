import { GetStaticProps, GetStaticPaths } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import withAuth from '@/hoc/withAuth';
import {authUser} from "@/types/interfaceClass"

import {NavDashBoard} from "@/components/NavDashBoard"
import {HeaderDashBoard} from "@/components/HeaderDashBoard"

import {DefaultInput, SelectInput} from "@/components/Input"

import styles from '@/styles/pages/actionsTeam.module.scss' 

import {getTeamViwer} from "@/services/function.dashboard.team"
import {DashboardInformationsProps} from "@/types/interfaceClass"

import {NormilizeTypeReport} from "@/lib/normalizeInformationToFront"


function DashboardReport({ nameTeam, messages, authUser}: { messages: any, nameTeam: string, authUser: authUser}){
    const router = useRouter();
    const [typeReport, setTypeReport] = useState<string>("");
    const [information, setInformation] = useState<DashboardInformationsProps>()

    const [reportName, setReportName] = useState<string>("")
    const [reportDoc, setReportDoc] = useState<any>()
    const [reportCoordinator, setReportCoordinator] = useState<string>("")

    function sendReport(){

    }

    useEffect(() => {
        async function get(){
            const requestInformations = await getTeamViwer()
            setInformation(requestInformations)
        }
        get()
    },[])

    useEffect(() => {
        const res = router.query.res;

        if (Array.isArray(res)) {
            setTypeReport(res[0]);
        } else if (res) {
            setTypeReport(res);
        }
    }, [router.query]);

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
                        <span className={styles.titleContent}>Relatório {NormilizeTypeReport(typeReport)} | ART n° {information?.artAllocatedTeam}</span>
                        
                        <form className={styles.contentInputs}>
                            <DefaultInput minLength={10} placeholder="Nome do relatório" returnValue={(e) => setReportName(e)} text="Nome do relatório" type="text" value={reportName} key={"key-report-name"}/>
                            <DefaultInput minLength={1} placeholder="Documento" returnValue={(e) => setReportDoc(e)} text="Documento" type="file" value={reportDoc} key={"key-report-doc"}/>
                            <DefaultInput minLength={10} placeholder="Responsável" returnValue={(e) => {}} text="Resposável" type="text" value={authUser.user.name} key={"key-report-responsable"}/>
                            <SelectInput courses={["Nome Coordenadores"]} returnValue={(e) => setReportCoordinator(e)} text="Coordenador Responsável" value={reportCoordinator} key={"key-report-coordinator"}/>
                            <button className={styles.buttonForm} title="Send" onClick={() => sendReport()}>Enviar</button>
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

export default withAuth(DashboardReport);