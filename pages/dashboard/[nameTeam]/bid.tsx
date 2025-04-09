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

function DashboardBid({ nameTeam, messages, authUser }: { messages: any, nameTeam: string, authUser: authUser}){
    const { locale } = useRouter();
    const [information, setInformation] = useState<DashboardInformationsProps>()

    const [bidCode, setBidCode] = useState<string>("")
    const [bidType, setBidType] = useState<string>("")
    const [bidDoc, setBidDoc] = useState<any>()
    const [bidArt, setBidArt] = useState<string>("")

    useEffect(() => {
        async function get(){
            const requestInformations = await getTeamViwer()
            setInformation(requestInformations)
            setBidArt(requestInformations.artAllocatedTeam)
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
                        <span className={styles.TitleSection}>Equipe <b style={{color: information?.colorTeam}}>{nameTeam}</b></span>
                        <span className={styles.titleContent}>Requisição de Licitação | ART º {information?.artAllocatedTeam}</span>
                        
                        <form className={styles.contentInputs}>
                            <DefaultInput minLength={10} placeholder="Code" returnValue={(e) => {}} text="Code" type="text" value={bidCode} key={"key-bid-name"}/>
                            <SelectInput courses={["Compra"]} returnValue={(e) => {setBidType(e)}} text="Tipo de licitação" value={bidType} key={"key-bid-type"}/>
                            <DefaultInput minLength={1} placeholder="Documento" returnValue={(e) => {setBidDoc(e)}} text="Documento" type="file" value={bidDoc} key={"key-bid-doc"}/>
                            <SelectInput courses={ information?.roleTeam == "leader" ? ["MotoStudent", "ART #125616261", "ART #1257162176"] : [`#${information?.artAllocatedTeam}`]} returnValue={(e) => {setBidCode(e)}} text="Beneficiário" value={bidArt} key={"key-bid-art"}/>
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

export default withAuth(DashboardBid);