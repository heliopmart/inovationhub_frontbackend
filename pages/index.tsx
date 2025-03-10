import { GetStaticProps } from "next";
import { getTranslations } from "@/lib/getTranslations";
import {TextImageDescrition} from "@/components/TextImageDescrition";
import style from "@/styles/pages/index.module.scss"

export default function Index({ messages }: { messages: any }) {
    return (
        <>
            <header className={style.header}>
                <h2 className={style.titleHeader}>{messages.titleHeader}</h2>
                <p className={style.pHeader} dangerouslySetInnerHTML={{ __html: messages.pHeader }} />
                <button className={style.btnHeader} title={messages.btnHeader} dangerouslySetInnerHTML={{ __html: messages.btnHeader }} />
            </header>
            <section data-text={"Equipes que compõe o hub de inovações | UFGD"} className={style.sectionProjects}>
                <div className={style.projectIcon} >
                    <img src={""} alt="Name Project" />
                </div>
            </section>
            <main className={style.main}>
                <TextImageDescrition image="" direction="right">
                    <div className={style.contentDescription}>
                        <h6 className={style.titleContent} dangerouslySetInnerHTML={{__html: messages.main.content_apresentation_1.title}}/>
                        <p className={style.pContent} dangerouslySetInnerHTML={{__html: messages.main.content_apresentation_1.p}}/>
                    </div>
                </TextImageDescrition>

                <TextImageDescrition image="" direction="left">
                    <div className={style.contentDescription}>
                        <h6 className={style.titleContent} dangerouslySetInnerHTML={{__html: messages.main.content_apresentation_2.title}}/>
                        <p className={style.pContent} dangerouslySetInnerHTML={{__html: messages.main.content_apresentation_2.p}}/>
                    </div>
                </TextImageDescrition>
            </main>
            <section data-text={"NOSSOS PARCEIROS APOIAM A INOVAÇÃO"} className={style.sectionPartners}>
                <div className={style.partnersIcon} >
                    <img src={""} alt="Name Project" />
                </div>
                <div className={style.partnersIcon} >
                    <img src={""} alt="Name Project" />
                </div>
            </section>
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = await getTranslations("index", locale || "pt");

    return {
        props: { messages },
    };
};
