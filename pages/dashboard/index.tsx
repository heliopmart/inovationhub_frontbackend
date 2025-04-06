import { GetStaticProps } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import withAuth from '@/hoc/withAuth';
import { useEffect, useState } from "react";

import {NavDashBoard} from "@/components/NavDashBoard"
import {HeaderDashBoard} from "@/components/HeaderDashBoard"

import styles from '@/styles/pages/dashboard_index.module.scss' 

import {authUser} from "@/types/interfaceClass"


function DashboardResume({messages, authUser}: { messages: any, authUser: authUser}){
    const { locale } = useRouter();

    return (
        <section className={styles.section}>
            <div className={styles.menuContent}>
                <NavDashBoard links={messages.links.links}/>
            </div>
            <div className={styles.paintContent}>
                <HeaderDashBoard imageUser={authUser?.user?.image} nameUser={authUser?.user?.name} key={"header-dashboard-index"}/>
                <div className={styles.container}>
                    <section className={styles.sectionContent}>
                        <span className={styles.TitleSection}>Minhas Atribuições:</span>
                        {/* tabela */}
                    </section>
                    <section className={styles.sectionContent}>
                        <span className={styles.TitleSection}>Informações Importântes</span>
                        {/* tabela */}
                    </section>
                    <section className={styles.sectionContent}>
                        <span className={styles.TitleSection}>Últimas Atualizações</span>
                        <div className={styles.contentChanges}>
                            <div className={styles.container}>

                            </div>
                            <div className={styles.container}>
                                
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = {
        messages: await getTranslations("resume", locale || "pt"),
        links: await getTranslations("NavDashBoard", locale || "pt")
    }

    return {
        props: { messages },
    };
};


export default withAuth(DashboardResume);