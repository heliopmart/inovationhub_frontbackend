import { GetStaticProps } from "next";
import Link from 'next/link'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/getTranslations";

import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';
import {TextImageDescrition} from "@/components/TextImageDescrition";
import {Banner} from "@/components/Banner"
import {Event} from "@/components/Event"

import styles from "@/styles/pages/externalSolution.module.scss"

import {getInvestor} from "@/services/function.externSolution"
import {Investor} from "@/types/interfacesSql"

interface InterfaceProjects{
    nucleiTitle: string,
    titleProject: string,
    p: string,
    link: string,
    color: string,
    image: string,
    direction?: string
}

interface InterfaceOldEvent{
    title: string,
    time: string,
    p: string,
    inscriptions: {
        title: string,
        value: string
    },
    sponsors: {
        title: string, 
        value: string[],
    },
    images: string[]
}

interface InterfaceEvent{
    title: string,
    p: string,
    local: {
        local: string,
        time: string
    },
    linkTitle: string,
    link: string
}

const setDirectionForComponent = (data:Investor[]):Investor[] => {
    const directionSet = ["left", "right"]
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if(i % 2 == 0){
            element.direction = directionSet[0]
        }else{
            element.direction = directionSet[1]
        }
    }
    return data
}

export default function aboutUs({ messages }: { messages: any }) {
    const [txtFooter, setTxtFooter] = useState({});
    const [txtNav, setTxtNav] = useState({});
    const { locale } = useRouter();

    const [investor, setInvestor] = useState<Investor[]>([])
    
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
            const resInvestor = await getInvestor()
            if(resInvestor.st)
                setInvestor(resInvestor.value)
            
            console.log(resInvestor.value)
        }
        get()
    },[])

    return (
        <>
            <Navbar messages={txtNav} page="externalSolution" styleColor="#9F73EB" key={"externalSolution-Nav"}/>
            <header className={styles.header}>
                <h1 dangerouslySetInnerHTML={{__html: messages.titleHeader}}/>
            </header>

            <section className={styles.externalSolutionSection} id="innovativeProjects">
                <p dangerouslySetInnerHTML={{__html: messages.pHeader}}/>
            </section>
            <Banner text={messages.textBanner_1} color="#C15EB4" key={"changeword-banner-key"}/>
            <main className={styles.mainSection} id="partnerships">
                {
                    setDirectionForComponent(investor)?.map((data, index) => (
                        <TextImageDescrition key={`${index}-projects`} image={data.image} direction={data.direction as "left" | "right"} form={"stretch"}>
                            <div className={`${styles.contentDescription}`}>
                                <div className={styles.contentTitleDescription}>
                                    <span className={styles.titleNuclei}>{data.descriptionInvestment}</span>
                                    <h6 className={styles.titleContent} style={{color:  data.color}} dangerouslySetInnerHTML={{__html: data.name}}/>
                                </div>

                                <p className={styles.pContent} dangerouslySetInnerHTML={{__html: data.description}}/>
                                <Link href={data.link}> <button className={styles.button} style={{backgroundColor: data.color}} title={messages.textButton}>{messages.textButton}</button> </Link>
                            </div>
                        </TextImageDescrition>
                    ))
                }
            </main>
            <Banner text={messages.textBanner_2} color="#C1935E" key={"searchchangeword-banner-key"}/>
            <section className={styles.sectionEvent} id="events">
                <h2 className={styles.titleSectionEvent} dangerouslySetInnerHTML={{__html: messages.event.title}}/>
                <p className={styles.pEvent} dangerouslySetInnerHTML={{__html: messages.event.pEvent}}/>

                <div className={styles.containerEvents}>
                    <h2 className={styles.title}>{messages.event.nextEvents.title}</h2>
                    <div className={styles.contentNextEvents}>
                        {
                            messages.event.nextEvents.nextEvents?.map((data:InterfaceEvent, index:number) => (
                                <Event title={data.title} local={data.local} linkTitle={data.linkTitle} link={data.link} p={data.p} key={`${index}-nextEvent`}/>
                            ))
                        }
                    </div>
                </div>
                <div className={styles.containerEvents}>
                    <h2 className={styles.title}>{messages.event.oldEvents.title}</h2>
                    <div className={styles.contentOldEvents}>
                        {
                            messages.event.oldEvents.oldEvents?.map((data:InterfaceOldEvent, index:number) => (
                                <TextImageDescrition key={`${index}-oldEvents`} image={data.images[0]} direction={"right"} form={"stretch"}>
                                    <div className={`${styles.contentDescription}`}>
                                        <h6 className={styles.titleContent} dangerouslySetInnerHTML={{__html: `${data.title} - ${data.time}`}}/>

                                        <p className={styles.pContent} dangerouslySetInnerHTML={{__html: data.p}}/>
                                        
                                        <div className={styles.containerInformations}>
                                            <div className={styles.contentInformation}>
                                                <span className={styles.textInformation}>{data.inscriptions.title}</span>
                                                <span className={styles.textValue}>{data.inscriptions.value}</span>
                                            </div>
                                            <div className={styles.contentInformation}>
                                                <span className={styles.textInformation}>{data.sponsors.title}</span>
                                                <span className={styles.textValue}>{data.sponsors.value.join(" | ")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TextImageDescrition>
                            ))
                        }
                    </div>
                </div>
            </section>


            {txtFooter?(<Footer messages={txtFooter}/> ):""}
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = await getTranslations("externalSolution", locale || "pt");

    return {
        props: { messages },
    };
};
