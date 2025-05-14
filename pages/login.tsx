import { GetStaticProps } from "next";
import Link from 'next/link'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/getTranslations";

import Navbar from "@/components/Navbar";
import {DefaultInput} from "@/components/Input"

import styles from "@/styles/pages/login.module.scss"

import {getLogIn, userIsLog} from "@/services/function.login"
import {verifyEmail} from "@/lib/regex.email"

export default function aboutUs({ messages }: { messages: any }) {
    const [txtNav, setTxtNav] = useState({});
    const { locale } = useRouter();
    const router = useRouter();

    const [warning, setWarning] = useState({display: "none", text: messages.warning[0]})
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    
    async function logIn(){
        const emailVerification = email.length > 0 && verifyEmail(email)
        const passwordVerification = password.length > 0

        if(emailVerification && passwordVerification){
            const responseLog = await getLogIn(email, password)

            if(!responseLog){
                setWarning({display: "flex", text: "Email ou senhas incorretos"})
                return 
            }

            router.push("/dashboard/")
        }else{
            setWarning({display: "flex", text: "Email ou senhas invalidos, preencha todos corretamente!"})
        }
    }

    useEffect(() => {
        async function checkUser() {
            const response = await userIsLog()
            if(response){
                router.push("/dashboard/")
            }
        }
        checkUser()
    }, [])

    useEffect(() => {
    async function loadMessages() {
        const translationsNav = await getTranslations("navbar", locale || "pt");
        setTxtNav(translationsNav)
    }
    loadMessages();
    }, [locale]);

    return (
        <>
            <Navbar messages={txtNav} page="login" styleColor="#72873B" key={"login-Nav"}/>
            <main className={styles.containerMain} style={{background: "linear-gradient(78deg, #fff 46%, #E1FFCA 100%)"}}>
                <h1> {messages.titlePage}  </h1>
                <section className={styles.content}>
                    <p dangerouslySetInnerHTML={{__html: messages.pPage}}/>
                    <hr />
                    <div style={{background: "#55584C", display: warning.display}} className={styles.warning} >
                        <span>{warning.text}</span>
                    </div>
                    <form className={styles.contentInputs}>
                        <DefaultInput text={messages.inputs.email.text} minLength={messages.inputs.email.minLenght} type={messages.inputs.email.type} placeholder={messages.inputs.email.placeholder} value={email} returnValue={(t) => {setEmail(t)}} key={"email-input"} />
                        <DefaultInput isPassword={true} text={messages.inputs.password.text} minLength={messages.inputs.password.minLenght} type={messages.inputs.password.type} placeholder={messages.inputs.password.placeholder} value={password} returnValue={(t) => {setPassword(t)}} key={"email-input"} />
                        
                        <button type="button" onClick={() => logIn()} className={styles.button} title={messages.textButton} style={{background: "#72873B"}}>{messages.textButton}</button>
                    </form>
                    <span className={styles.other}>{messages.others.text} <Link href={messages.others.link}>{messages.others.textLink}</Link></span>
                </section>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = await getTranslations("login", locale || "pt");
    
    return {
        props: { messages },
    };
};
