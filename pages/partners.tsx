import { GetStaticProps } from "next";
import Link from 'next/link'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/getTranslations";

import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';
import {HeaderMinify} from "@/components/HeaderMinify"
import {TextImageDescrition} from "@/components/TextImageDescrition";
import {Banner} from "@/components/Banner"
import {Docs} from "@/components/Docs"
import {PartnersContact} from "@/components/PartnersContact"

import styles from "@/styles/pages/partners.module.scss"

import { getGovernanceDocs } from "@/services/function.partners"
import { NormalizeFinanceDocsProps } from "@/types/interfaceClass"

interface InterfaceMessageInformations{
    title: string,
    p: string,
    image: string,
    direction?: string
}

const setDirectionForComponent = (data:InterfaceMessageInformations[]):InterfaceMessageInformations[] => {
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

export default function Partners({ messages }: { messages: any }) {
    const [txtFooter, setTxtFooter] = useState({});
    const [txtNav, setTxtNav] = useState({});
    const { locale } = useRouter();
    
    const [email, setEmail] = useState<string>("")
    const [economic, setEconomic] = useState<string>("")
    const [user, setUser] = useState<string>("")
    const [role, setRole] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [isSend, setIsSend] = useState<boolean>(false)

    const [docs, setDocs] = useState<NormalizeFinanceDocsProps[]>([])
    
    function ButtonSend(){
        setIsSend(true)
    }

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
            const resFinanceDocs = await getGovernanceDocs()
                      
            if(resFinanceDocs.st)
                setDocs(resFinanceDocs.value)

        }
        get()
    },[])

    return (
        <>
            <Navbar messages={txtNav} page="partners" styleColor="#E97777" key={"partners-Nav"}/>
            <HeaderMinify title={messages.titleHeader} background={"linear-gradient(78deg, #fff 46%, #E97777 100%)"}  key={"internSolutions-Head"}/>

            <section className={styles.partnersSection} id="becomePartner">
                <p dangerouslySetInnerHTML={{__html: messages.pHeader}}/>
            </section>
            <main className={styles.mainSection} id="partnerships">
                {
                    setDirectionForComponent(messages?.informations).map((data, index) => (
                        <TextImageDescrition key={`${index}-partnersInformation`} image={data.image} direction={data.direction as "left" | "right"} form={"stretch"}>
                            <div className={`${styles.contentDescription}`}>
                                <div className={styles.contentTitleDescription}>
                                    <h6 className={styles.titleContent} dangerouslySetInnerHTML={{__html: data.title}}/>
                                </div>
                                <p className={styles.pContent} dangerouslySetInnerHTML={{__html: data.p}}/>
                            </div>
                        </TextImageDescrition>
                    ))
                }
            </main>
            <section className={styles.sectionDocs}>
                <h2 className={styles.title}>{messages.docsTitle}</h2>
                <Docs docs={docs} key={"DocsPartners"}/>
            </section>
            <Banner text={messages.textBanner_1} color="#825454" key={"changeword-banner-key"}/>
            <section id="contacts">
                <PartnersContact  ButtonSend={ButtonSend} isSend={isSend} EconomicEnterprise={(e) => setEconomic(e)} EmailEnterprise={(e) => setEmail(e)} NameEnterprise={(e) => setName(e)} RoleEnterprise={(e) => setRole(e)} UserEnterprise={(e) => setUser(e)} economic={economic} email={email} message={messages.contact} name={name} role={role} user={user} key={"contact-partners"}/>
            </section>

            {txtFooter?(<Footer messages={txtFooter}/> ):""}
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = await getTranslations("partners", locale || "pt");

    return {
        props: { messages },
    };
};
