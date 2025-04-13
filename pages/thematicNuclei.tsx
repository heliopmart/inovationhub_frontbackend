import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/getTranslations";

import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';
import {HeaderMinify} from "@/components/HeaderMinify";
import {TextImageDescrition} from "@/components/TextImageDescrition";
import {NucleiComponent} from '@/components/NucleiComponent'

import styles from "@/styles/pages/thematicNuclei.module.scss"

import {getNucleiDirectors} from "@/services/function.nuclei"
import {ReturNormalizeNucleiDirector} from "@/types/interfacesSql"

type roles = {
    director: {
        textRole: string
        name: string,
        email: string,
        tell: string
    },
    coordinator: {
        textRole: string,
        name: string, 
        email: string,
        tell: string
    }
}
interface InterfaceNucleiComponent{
    nucleiName: string,
    p: string,
    roles: roles,
    imageBanner: string,
    color_1: string,
    color_2: string
}

export default function aboutUs({ messages }: { messages: any }) {
    const [txtFooter, setTxtFooter] = useState({});
    const [txtNav, setTxtNav] = useState({});
    const [nucleiBd, setNuclei] = useState<ReturNormalizeNucleiDirector[]>([])
    const { locale } = useRouter();
    
    useEffect(() => {
    async function loadMessages() {
        const translationsFooter = await getTranslations("footer", locale || "pt");
        const translationsNav = await getTranslations("navbar", locale || "pt");
        setTxtFooter(translationsFooter);
        setTxtNav(translationsNav)
    }
    loadMessages();
    }, [locale]);

    useEffect(() => {
        async function get(){
            const resNuclei = await getNucleiDirectors()
            if(resNuclei.st)
                setNuclei(resNuclei.value)
        }
        get()
    },[])

    return (
        <>
            <Navbar messages={txtNav} page="thematicNuclei" styleColor="#67839A" key={"thematicNuclei-Nav"}/>
            <HeaderMinify title={messages.titleHeader} background={"linear-gradient(78deg, #fff 46%, #C9E6FF 100%)"}  key={"thematicNuclei"}/>
            <section className={styles.thematicNucleiSection} id="aboutThematicNuclei">
                <TextImageDescrition image={messages.thematicNucleiSectionDescription.image} direction="right">
                    <div className={styles.contentDescription}>
                        <h6 className={styles.titleContent} dangerouslySetInnerHTML={{__html:messages.thematicNucleiSectionDescription.title}}/>
                        <p className={styles.pContent} dangerouslySetInnerHTML={{__html: messages.thematicNucleiSectionDescription.p}}/>
                    </div>
                </TextImageDescrition>
            </section>
            <hr />
            <main className={styles.mainSection}>
                <h2 className={styles.titleMainSection}>O Hub de inovações trabalha com <b>cinco núcleos temáticos</b></h2>
                {
                    messages?.nuclei?.map((nuclei:InterfaceNucleiComponent, index:number) => (
                        <NucleiComponent color_1={nuclei.color_1} color_2={nuclei.color_2} imageBanner={nuclei.imageBanner} nucleiName={nuclei.nucleiName} p={nuclei.p} roles={nucleiBd?.filter((data) => data.name == nuclei?.nucleiName)[0]?.roles as roles} key={`${nuclei.nucleiName}_${index}`} />
                    ))
                }
                
            </main>


            {txtFooter?(<Footer messages={txtFooter}/> ):""}
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = await getTranslations("thematicNuclei", locale || "pt");

    return {
        props: { messages },
    };
};
