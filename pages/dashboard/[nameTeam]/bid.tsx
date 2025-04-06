import { GetStaticProps, GetStaticPaths } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {NavDashBoard} from "@/components/NavDashBoard"
import {HeaderDashBoard} from "@/components/HeaderDashBoard"

import {DefaultInput, SelectInput} from "@/components/Input"

import styles from '@/styles/pages/actionsTeam.module.scss' 

import {getTeamsByRootPage} from "@/services/function.dashboard.team"
import {TeamsByRootPageProps} from "@/types/interfaceDashboardSql"

export default function DashboardResume({ nameTeam, color, artName, artID, messages }: { messages: any, nameTeam: string, color: string, artName: string, artID: string}){
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
                        <span className={styles.titleContent}>Requisição de Licitação | ART º {artID} - {artName}</span>
                        
                        <form className={styles.contentInputs}>
                            <DefaultInput minLength={10} placeholder="Code" returnValue={(e) => {}} text="Code" type="text" value={""} key={"key-bid-name"}/>
                            <SelectInput courses={["Compra"]} returnValue={(e) => {}} text="Tipo de licitação" value={""} key={"key-bid-type"}/>
                            <DefaultInput minLength={1} placeholder="Documento" returnValue={(e) => {}} text="Documento" type="file" value={""} key={"key-bid-doc"}/>
                            <SelectInput courses={["MotoStudent", "ART #125616261", "ART #1257162176"]} returnValue={(e) => {}} text="Beneficiário" value={""} key={"key-bid-art"}/>
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
        const artName = project.art?.name || "";
        const artID = String(project.art?.id || "0");

        const messages = {
            links: await getTranslations("NavDashBoard", locale || "pt")
        };

        return {
            props: { nameTeam, color, messages, artName, artID },
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