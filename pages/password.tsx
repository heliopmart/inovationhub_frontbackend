import { GetStaticProps } from "next";
import Link from 'next/link'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/getTranslations";

import Navbar from "@/components/Navbar";
import {DefaultInput} from "@/components/Input"

import styles from "@/styles/pages/login.module.scss"

export default function aboutUs({ messages }: { messages: any }) {
    const [txtNav, setTxtNav] = useState({});
    const { locale } = useRouter();

    const [warning, setWarning] = useState({display: "none", text: messages.warning[0]})
    const [warningPass, setWarningPas] = useState("none")
    const [email, setEmail] = useState<string>("")
    
    useEffect(() => {
    async function loadMessages() {
        const translationsNav = await getTranslations("navbar", locale || "pt");
        setTxtNav(translationsNav)
    }
    loadMessages();
    }, [locale]);

    return (
        <>
            <Navbar messages={txtNav} page="password" styleColor="#67839A" key={"password-Nav"}/>
            <main className={styles.containerMain} style={{background: "linear-gradient(78deg, #fff 46%, #C9E7FF 100%)"}}>
                <h1> {messages.titlePage}  </h1>
                <section className={styles.content}>
                    <p dangerouslySetInnerHTML={{__html: messages.pPage}}/>
                    <hr />
                    <div style={{background: "#4C5758", display: warning.display}} className={styles.warning} >
                        <span>{warning.text}</span>
                    </div>
                    <form className={styles.contentInputs}>
                        <DefaultInput text={messages.inputs.email.text} minLength={messages.inputs.email.minLenght} type={messages.inputs.email.type} placeholder={messages.inputs.email.placeholder} value={email} returnValue={(t) => {setEmail(t)}} key={"email-input"} />

                        <p style={{display: warningPass}} className={styles.warningPassword} dangerouslySetInnerHTML={{__html: messages.pWarningPassword}}/>
                        
                        <button className={styles.button} title={messages.textButton} style={{background: "#67839A"}}>{messages.textButton}</button>
                    </form>
                    <span className={styles.other}>{messages.others.text} <Link href={messages.others.textLink}>{messages.others.textLink}</Link></span>
                </section>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = await getTranslations("password", locale || "pt");
    
    return {
        props: { messages },
    };
};
