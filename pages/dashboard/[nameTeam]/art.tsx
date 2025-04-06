import { GetStaticProps, GetStaticPaths } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {NavDashBoard} from "@/components/NavDashBoard"
import {HeaderDashBoard} from "@/components/HeaderDashBoard"

import {ComponentUsersToLeaderART} from "@/components/ComponentDashboard"
import {DefaultInput, SelectInput} from "@/components/Input"

import styles from '@/styles/pages/actionsTeam.module.scss' 

import {getTeamsByRootPage} from "@/services/function.dashboard.team"
import {TeamsByRootPageProps} from "@/types/interfaceDashboardSql"

export default function DashboardResume({ nameTeam, color, messages }: { messages: any, nameTeam: string, color: string}){
    const { locale } = useRouter();
    return (
        <section className={styles.section}>
            <div className={styles.menuContent}>
                <NavDashBoard links={messages.links.links}/>
            </div>
            <div className={styles.paintContent}>
                <HeaderDashBoard nameTeam={nameTeam}/>
                <div className={styles.container}>
                    <section className={styles.sectionContent}>
                        <span className={styles.TitleSection}>Equipe <b style={{color: color}}>{nameTeam}</b></span>
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

    try {
        const acceptTeamsByThisId = await getTeamsByRootPage("1");

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

        const color = project.Team.color || "#1a1a1a";

        const messages = {
            links: await getTranslations("NavDashBoard", locale || "pt")
        };

        return {
            props: { nameTeam, color, messages},
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
};