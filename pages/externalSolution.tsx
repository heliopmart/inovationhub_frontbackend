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

import {getInvestor, getEvents} from "@/services/function.externSolution"
import {Investor, Events} from "@/types/interfacesSql"

const SetDate = (dateString:string):string => {
    const date = new Date(dateString);

  // Ajustar para o fuso de Mato Grosso do Sul (UTC-4)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Campo_Grande', // Fuso de MS
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  const formatter = new Intl.DateTimeFormat('pt-BR', options);
  const formatted = formatter.format(date);

  // Resultado vem como "07/04/2025 08:00", precisamos formatar com " - "
  return formatted.replace(' ', ' - ');
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
    const [events, setEvents] = useState<Events[]>([])
    const [eventsHeld, setEventsHeld] = useState<Events[]>([])
    
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
            const resEvents = await getEvents()
            if(resInvestor.st)
                setInvestor(resInvestor.value)

            if(resEvents.st){
                setEvents(resEvents.value.event)
                setEventsHeld(resEvents.value.eventHeld)
            }                        
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
                            events?.map((data:Events, index:number) => (
                                <Event title={data.name} local={{local: data.local, time: SetDate(data.date)}} linkTitle={"Inscrever-se"} link={data.link ? data.link : ""} p={data.minifyDescription} key={`${index}-nextEvent`}/>
                            ))
                        }
                    </div>
                </div>
                <div className={styles.containerEvents}>
                    <h2 className={styles.title}>{messages.event.oldEvents.title}</h2>
                    <div className={styles.contentOldEvents}>
                        {
                           eventsHeld?.map((data:Events, index:number) => (
                                <TextImageDescrition key={`${index}-oldEvents`} image={data.image} direction={"right"} form={"stretch"}>
                                    <div className={`${styles.contentDescription}`}>
                                        <h6 className={styles.titleContent} dangerouslySetInnerHTML={{__html: `${data.name} - ${SetDate(data.date)}`}}/>

                                        <p className={styles.pContent} dangerouslySetInnerHTML={{__html: data.description}}/>
                                        
                                        <div className={styles.containerInformations}>
                                            <div className={styles.contentInformation}>
                                                <span className={styles.textInformation}>{"Inscrições"}</span>
                                                <span className={styles.textValue}>{data.registrationsMade}</span>
                                            </div>
                                            <div className={styles.contentInformation}>
                                                <span className={styles.textInformation}>{"Patrocinadores: "}</span>
                                                <span className={styles.textValue}>{data.sponsors.map((sponsor: {investor: {name: string }}) => sponsor.investor.name).join(" | ")}</span>
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
