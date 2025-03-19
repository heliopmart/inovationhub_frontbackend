import { GetStaticProps } from "next";
import Link from 'next/link'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/getTranslations";

import Navbar from "@/components/Navbar";
import {DefaultInput, SelectInput} from "@/components/Input"

import styles from "@/styles/pages/login.module.scss"

export default function aboutUs({ messages }: { messages: any }) {
    const [txtNav, setTxtNav] = useState({});
    const { locale } = useRouter();

    const [warning, setWarning] = useState({display: "none", text: messages.warning[0]})
    const [email, setEmail] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [course, setCourse] = useState<string>("0")
    
    useEffect(() => {
    async function loadMessages() {
        const translationsNav = await getTranslations("navbar", locale || "pt");
        setTxtNav(translationsNav)
    }
    loadMessages();
    }, [locale]);

    return (
        <>
            <Navbar messages={txtNav} page="register" styleColor="#E9A476" key={"register-Nav"}/>
            <main className={styles.containerMain}>
                <h1> {messages.titlePage}  </h1>
                <section className={styles.content}>
                    <p dangerouslySetInnerHTML={{__html: messages.pPage}}/>
                    <hr />
                    <div className={styles.warning} style={{display: warning.display}}>
                        <span>{warning.text}</span>
                    </div>
                    <form className={styles.contentInputs}>
                        <DefaultInput text={messages.inputs.email.text} minLength={messages.inputs.email.minLenght} type={messages.inputs.email.type} placeholder={messages.inputs.email.placeholder} value={email} returnValue={(t) => {setEmail(t)}} key={"email-input"} />
                        <DefaultInput text={messages.inputs.name.text} minLength={messages.inputs.minLenght} type={messages.inputs.name.type} placeholder={messages.inputs.name.placeholder} value={name} returnValue={(t) => {setName(t)}} key={"name-input"} />
                        <DefaultInput text={messages.inputs.password.text} minLength={messages.inputs.password.minLenght} type={messages.inputs.password.type} placeholder={messages.inputs.password.placeholder} value={password} returnValue={(t) => {setPassword(t)}} key={"email-input"} />
                        <SelectInput text={messages.inputs.course.text} courses={messages.inputs.course.options} returnValue={(t) => {setCourse(t)}} value={course} key={"curses-input"}/>
                        
                        <button className={styles.button} title={messages.textButton}>{messages.textButton}</button>
                    </form>
                    <span className={styles.other}>{messages.others.text} <Link href={messages.others.textLink}>{messages.others.textLink}</Link></span>
                </section>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = await getTranslations("register", locale || "pt");
    
    return {
        props: { messages },
    };
};
