import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/getTranslations";
import Navbar from "@/components/Navbar";
import {TextImageDescrition} from "@/components/TextImageDescrition";
import Footer from '@/components/Footer';
import style from "@/styles/pages/index.module.scss"

import {ReturnNameIcon} from "@/types/interfacesSql"
import {getTeams, getInvestor} from '@/services/function.index'

export default function Index({ messages }: { messages: any }) {
    const [txtFooter, setTxtFooter] = useState({});
    const [txtNav, setTxtNav] = useState({});
    const [teams, setTeams] = useState<ReturnNameIcon[]>([])

    const [investor, setInvestor] = useState<ReturnNameIcon[]>([]);
    const { locale } = useRouter();
    
    useEffect(() => {
        async function loadMessages() {
            const translationsFooter = await getTranslations("footer", locale || "pt");
            const translationsNav = await getTranslations("navbar", locale || "pt");
            setTxtFooter(translationsFooter);
            setTxtNav(translationsNav)
        }
        loadMessages()
    }, [locale]);
    useEffect(() => {
        async function get(){
            const resGetTeam = await getTeams();
            const resGetInvestor = await getInvestor();
            if(resGetTeam.st)
                setTeams(resGetTeam.value)
            if(resGetInvestor.st)
                setInvestor(resGetInvestor.value) 
        }
        get()
    })
    return (
        <>
            <Navbar messages={txtNav} />
            <header className={style.header}>
                <h2 className={style.titleHeader}>{messages.titleHeader}</h2>
                <p className={style.pHeader} dangerouslySetInnerHTML={{ __html: messages.pHeader }} />
                <button className={style.btnHeader} title={messages.btnHeader} dangerouslySetInnerHTML={{ __html: messages.btnHeader }} />
            </header>
            <section data-text={"Equipes que compõe o hub de inovações | UFGD"} className={style.sectionProjects}>
                {
                    teams?.map((team, index) => (
                        <div className={style.projectIcon} key={`${team.name}_${index}`}>
                            <img src={team.icon} alt={team.name} />
                        </div>
                    ))
                }
            </section>
            <main className={style.main}>
                <TextImageDescrition image="/assets/whatsInnovationHub_image.webp" direction="right">
                    <div className={style.contentDescription}>
                        <h6 className={style.titleContent} dangerouslySetInnerHTML={{__html: messages.main.content_apresentation_1.title}}/>
                        <p className={style.pContent} dangerouslySetInnerHTML={{__html: messages.main.content_apresentation_1.p}}/>
                    </div>
                </TextImageDescrition>

                <TextImageDescrition image="/assets/missionVision_image.webp" direction="left">
                    <div className={style.contentDescription}>
                        <h6 className={style.titleContent} dangerouslySetInnerHTML={{__html: messages.main.content_apresentation_2.title}}/>
                        <p className={style.pContent} dangerouslySetInnerHTML={{__html: messages.main.content_apresentation_2.p}}/>
                    </div>
                </TextImageDescrition>
            </main>
            <section data-text={"NOSSOS PARCEIROS APOIAM A INOVAÇÃO"} className={style.sectionPartners}>
                <div className={style.content}>
                    {investor?.map((item, index) => (
                        <div className={style.partnersIcon} key={`${index}-${item.name}`} >
                            <img src={item.icon} alt={item.name} />
                        </div>
                    ), "")}
                </div>
            </section>
            {txtFooter?(<Footer messages={txtFooter}/> ):""}
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = await getTranslations("index", locale || "pt");

    return {
        props: { messages },
    };
};
