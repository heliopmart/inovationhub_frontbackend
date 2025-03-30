import { GetStaticProps } from "next";
import Link from 'next/link'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/getTranslations";

import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';
import {HeaderMinify} from "@/components/HeaderMinify";
import {TextImageDescrition} from "@/components/TextImageDescrition";
import {Banner} from "@/components/Banner"
import {KpisComponent} from '@/components/KpisComponent'

import styles from "@/styles/pages/internSolution.module.scss"

import {getTeams} from "@/services/function.internSolution"
import {TeamMinify} from "@/types/interfacesSql"

type TypedataSeries = {
    name: string,
    values: number[],
    color: string
}


const setDirectionForComponent = (data:TeamMinify[]):TeamMinify[] => {
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

    const [teams, setTeams] = useState<TeamMinify[]>([])
     
    const [monthState, setMonthState] = useState(["Jan.", "Fev.", "Mar.", "Abr.", "Mai.", "Jun.", "Jul.", "Ago.", "Set.", "Out.", "Nov.", "Dez."])
    const [academicKpisState, setAcademicKpisState] = useState<TypedataSeries[]>([{name: "Trabalhos acadêmicos", values: [0,1,5,6], color: "#1E90FF"}, {name: "Publicações científicas vinculadas ao Hub de Inovações UFGD", values: [0, 5, 2, 4], color: "#32CD32"}, {name: "Número de professores e pesquisadores envolvidos", values: [3, 5, 10, 12, 24], color: "#FFD700"}, {name: "Quantidade de certificações emitidas para estudantes", values: [2, 12, 30, 24], color: "#FF4500"}])
    const [inovationKpisState, setInovationKpisState] = useState<TypedataSeries[]>([])
    const [managementKpisState, setManagementKpisState] = useState<TypedataSeries[]>([])
    const [impactKpisState, setImpactKpisState] = useState<TypedataSeries[]>([])


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
        const getXSubtext = (numYears = 1) => {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
        
            // Definir os anos passados que deseja incluir no começo do array
            const pastYears =  Array.from({ length: numYears }, (_, i) => currentYear - (numYears - 1 - i));
        
            // Criando a lista de meses até o mês atual do ano vigente
            const months = Array.from({ length: currentMonth + 1 }, (_, i) => {
                return new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(currentYear, i));
            });
        
            setMonthState([...pastYears.map(String), ...months])
        }
        async function get(){
            const resTeam = await getTeams()
            if(resTeam.st)
                setTeams(resTeam.value)

            
        }
        get()
        getXSubtext()
    },[])
    return (
        <>
            <Navbar messages={txtNav} page="internSolution" styleColor="#9F73EB" key={"internSolution-Nav"}/>
            <HeaderMinify title={messages.titleHeader} background={"linear-gradient(78deg, #fff 46%, #BB94FF 100%)"}  key={"internSolution"}/>            
            <section className={styles.internSolutionSection} id="innovativeProjects">
                <p dangerouslySetInnerHTML={{__html: messages.headerp}}/>
            </section>
            <Banner text={messages.textBanner_1} color="#9775FF" key={"changeword-banner-key"}/>
            <main className={styles.mainSection}>
                {
                    setDirectionForComponent(teams)?.map((data, index) => (
                        <TextImageDescrition key={`${index}-projects`} image={data.image} direction={data.direction as "left" | "right"} form={"stretch"}>
                            <div className={`${styles.contentDescription}`}>
                                <div className={styles.contentTitleDescription}>
                                    <span className={styles.titleNuclei}>Nucleo de {data?.nuclei?.[0]?.nuclei?.name}</span>
                                    <h6 className={styles.titleContent} style={{color:  data.color}} dangerouslySetInnerHTML={{__html: `Equipe ${data.name}`}}/>
                                </div>

                                <p className={styles.pContent} dangerouslySetInnerHTML={{__html: data.description}}/>
                                <Link href={`/team/${data.name}#aboutUs`}> <button className={styles.button} style={{backgroundColor: data.color}} title={messages.textButton}>{messages.textButton}</button> </Link>
                            </div>
                        </TextImageDescrition>
                    ))
                }
            </main>
            <Banner text={messages.textBanner_2} color="#C1935E" key={"searchchangeword-banner-key"}/>
            <section className={styles.sectionSearch} id="research">
                {
                    // setDirectionForComponent(messages.search)?.map((data, index) => (
                    //     <TextImageDescrition key={`${index}-research`} image={data.image} direction={data.direction as "left" | "right"} form={"stretch"}>
                    //         <div className={`${styles.contentDescription}`}>
                    //             <div className={styles.contentTitleDescription}>
                    //                 <span className={styles.titleNuclei}>{data.nucleiTitle}</span>
                    //                 <h6 className={styles.titleContent} style={{color:  data.color}} dangerouslySetInnerHTML={{__html: data.titleProject}}/>
                    //             </div>

                    //             <p className={styles.pContent} dangerouslySetInnerHTML={{__html: data.p}}/>
                    //             <Link href={data.link}> <button className={styles.button} style={{backgroundColor: data.color}} title={messages.textButton}>{messages.textButton}</button> </Link>
                    //         </div>
                    //     </TextImageDescrition>
                    // ))
                }
            </section>
            <div className={styles.OnduLine}>
                <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none">
                    <path d="M 0 100 
                        Q 100 0, 200 50 
                        T 400 50 
                        Q 500 0, 600 50 
                        T 800 50 
                        Q 900 0, 1000 50" 
                        stroke="#81BD78" stroke-width="3" stroke-dasharray="15,15" 
                        fill="transparent"/>
                </svg>
            </div>
            <section className={styles.sectionKpis} id="kpis">
                <h2 className={styles.titleSectionKpis} dangerouslySetInnerHTML={{__html: messages.titleKpis}}/>
                <div className={styles.kpisContainer}>
                    <KpisComponent title={messages.kpis[0]} month={monthState} dataSeries={academicKpisState} key={"AcademicKpis"}/>
                    <KpisComponent title={messages.kpis[1]} month={monthState} dataSeries={inovationKpisState} key={"InovationKpis"}/>
                    <KpisComponent title={messages.kpis[2]} month={monthState} dataSeries={managementKpisState} key={"ManagementKpis"}/>
                    <KpisComponent title={messages.kpis[3]} month={monthState} dataSeries={impactKpisState} key={"ImpactKpis"}/>
                </div>
            </section>


            {txtFooter?(<Footer messages={txtFooter}/> ):""}
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = await getTranslations("internSolution", locale || "pt");

    return {
        props: { messages },
    };
};
