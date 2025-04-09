import { GetStaticProps, GetStaticPaths } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {NavDashBoard} from "@/components/NavDashBoard"
import {HeaderDashBoard} from "@/components/HeaderDashBoard"

import {DefaultInput, SelectInput} from "@/components/Input"

import styles from '@/styles/pages/actionsTeam.module.scss' 

import {getTeamDashboardComplete, getArtDashboardComplete} from "@/services/function.dashboard.team"
import {TeamsByRootPageProps, ArtDashboardComplete} from "@/types/interfaceDashboardSql"

import {NormilizeTypeReport} from "@/lib/normalizeInformationToFront"


export default function DashboardResume({ nameTeam, color, messages, artName, artID }: { messages: any, color: string, nameTeam: string, artName:string, artID:string}){
    const router = useRouter();
    const [typeReport, setTypeReport] = useState<string>("");

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
                <HeaderDashBoard nameTeam={nameTeam} />
                <div className={styles.container}>
                    <section className={styles.sectionContent}>
                        <span className={styles.TitleSection}>Equipe <b style={{color: color}}>{nameTeam}</b></span>
                        <span className={styles.titleContent}>Relatório {NormilizeTypeReport(typeReport)} | ART n° {artID} - {artName} </span>
                        
                        <form className={styles.contentInputs}>
                            <DefaultInput minLength={10} placeholder="Nome do relatório" returnValue={(e) => {}} text="Nome do relatório" type="text" value={""} key={"key-report-name"}/>
                            <DefaultInput minLength={1} placeholder="Documento" returnValue={(e) => {}} text="Documento" type="file" value={""} key={"key-report-doc"}/>
                            <DefaultInput minLength={10} placeholder="Responsável" returnValue={(e) => {}} text="Resposável" type="text" value={""} key={"key-report-responsable"}/>
                            <SelectInput courses={["Nome Coorndenadores"]} returnValue={(e) => {}} text="Coordenador Responsável" value={""} key={"key-report-coordinator"}/>
                            <button className={styles.buttonForm} title="Send" onClick={() => {}}>Enviar</button>
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