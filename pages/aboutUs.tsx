import { GetStaticProps } from "next";
import Link from 'next/link'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/getTranslations";
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';
import {HeaderMinify} from "@/components/HeaderMinify";
import {TextImageDescrition, TextTwoImageDescrition} from "@/components/TextImageDescrition";
import styles from "@/styles/pages/aboutUs.module.scss"

export default function aboutUs({ messages }: { messages: any }) {
    const [txtFooter, setTxtFooter] = useState({});
    const [txtNav, setTxtNav] = useState({});
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

    return (
        <>
            <Navbar messages={txtNav} page="aboutUs" styleColor="#72873B" key={"aboutUs-Nav"}/>
            <HeaderMinify title={messages.titleHeader} background={"linear-gradient(78deg, #fff 46%, #DFFFC7 100%);"}  key={"aboutUs-Header"}/>
            <main className={styles.aboutUsSection} id="aboutProject">
                <TextImageDescrition image="/assets/image_2.png" direction="right">
                    <div className={styles.contentDescription}>
                        <h6 className={styles.titleContent} dangerouslySetInnerHTML={{__html: messages.aboutProject.whatIs.title}}/>
                        <p className={styles.pContent} dangerouslySetInnerHTML={{__html: messages.aboutProject.whatIs.p}}/>
                    </div>
                </TextImageDescrition>
                <TextImageDescrition image="/assets/image_4.png" direction="left">
                    <div className={styles.contentDescription}>
                        <h6 className={styles.titleContent} dangerouslySetInnerHTML={{__html: messages.aboutProject.visionMission.title}}/>
                        <p className={styles.pContent} dangerouslySetInnerHTML={{__html: messages.aboutProject.visionMission.p}}/>
                    </div>
                </TextImageDescrition>
            </main>
            <hr />
            <section className={styles.howDoesItWork}>
                <TextTwoImageDescrition image_1="" image_2="" direction="left">
                    <div className={styles.contentDescription}>
                        <h6 className={styles.titleContent} dangerouslySetInnerHTML={{__html: messages.aboutProject.howFun.title}}/>
                        <p className={styles.pContent} dangerouslySetInnerHTML={{__html: messages.aboutProject.howFun.p}}/>
                    </div>
                </TextTwoImageDescrition>
                <TextImageDescrition image="/assets/image_4.png" direction="right">
                    <div className={styles.contentDescription}>
                        <h6 className={styles.titleContent} dangerouslySetInnerHTML={{__html: messages.aboutProject.team.title}}/>
                        <p className={styles.pContent} dangerouslySetInnerHTML={{__html: messages.aboutProject.team.p}}/>
                    </div>
                </TextImageDescrition>
            </section>
            <section className={styles.sustainability}>
                <h3 dangerouslySetInnerHTML={{__html: messages.aboutProject.sustainability.title}}/>
                <p dangerouslySetInnerHTML={{__html: messages.aboutProject.sustainability.p}}/>
            </section>
            <section className={styles.efficiency}>
                <TextImageDescrition image="/assets/image_4.png" direction="left">
                    <div className={styles.contentDescription}>
                        <h6 className={styles.titleContent} dangerouslySetInnerHTML={{__html: messages.aboutProject.efficiency.title}}/>
                        <p className={styles.pContent} dangerouslySetInnerHTML={{__html: messages.aboutProject.efficiency.p}}/>
                    </div>
                </TextImageDescrition>
            </section>
            <hr />
            <section className={styles.founders} id="founders">
                <h2 dangerouslySetInnerHTML={{__html: messages.founders.title}}/>
                <div className={styles.contentFounders}>

                </div>
            </section>
            <section className={styles.responsible} id="responsible">
                <h2 dangerouslySetInnerHTML={{__html: messages.responsible.title}}/>
                <p dangerouslySetInnerHTML={{__html: messages.responsible.p}}/>
                <div className={styles.contentResponsible}>
                    <div className={styles.contentName}>
                        <span>Pró-reitoria de atividades de extensão da UFGD</span>
                    </div>
                    <div className={styles.contentInformation}>
                        <span className={styles.name}>{messages.responsible.rectory.name} | <b>Pró-Reitor(a) de Extensão e Cultura</b></span>
                        <span className={styles.email}>E-mail: <Link href={messages.responsible.rectory.email}>{messages.responsible.rectory.email}</Link></span>
                        <span className={styles.tell}>Telefone: {messages.responsible.rectory.tell}</span>
                    </div>
                </div>
                <div className={styles.containerCoor}>
                    <span className={styles.titleCoor}>{messages.responsible.nucleusCoordinatorsTitle}</span>
                    <div className={styles.contentCoor}>

                    </div>
                </div>
            </section>
            <div className={styles.contentBannerUfgd}  id="ufgd">
                <span dangerouslySetInnerHTML={{__html: messages.ufgd.titlebanner}}/>
            </div>
            <section className={styles.sectionufgd}>
                <TextImageDescrition image="" direction="left">
                    <div className={styles.contentDescription}>
                        <h6 className={styles.titleContent} dangerouslySetInnerHTML={{__html: messages.ufgd.ufgdImpacts.title}}/>
                        <p className={styles.pContent} dangerouslySetInnerHTML={{__html: messages.ufgd.ufgdImpacts.p}}/>
                    </div>
                </TextImageDescrition>
                <TextTwoImageDescrition image_1="" image_2="" direction="right">
                    <div className={styles.contentDescription}>
                        <h6 className={styles.titleContent} dangerouslySetInnerHTML={{__html: messages.ufgd.ufgdRelatioships.title}}/>
                        <p className={styles.pContent} dangerouslySetInnerHTML={{__html: messages.ufgd.ufgdRelatioships.p}}/>
                    </div>
                </TextTwoImageDescrition>
            </section>
            <hr />
            <section className={styles.docs} id="docs">

            </section>

            {txtFooter?(<Footer messages={txtFooter}/> ):""}
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = await getTranslations("aboutUs", locale || "pt");

    return {
        props: { messages },
    };
};
