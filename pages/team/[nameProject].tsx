import { useEffect, useState } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Link from 'next/link'

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HeaderMinify } from "@/components/HeaderMinify";
import { TextImageDescrition } from "@/components/TextImageDescrition";
import {Docs} from '@/components/Docs'
import {DynamicTable} from "@/components/DynamicTable"
import {ShowPeople} from "@/components/ShowPeople"

import styles from "@/styles/pages/team.module.scss";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TeamPageProps {
    nameProject: string;
    messages: any;
}


interface InterfaceTeam{
    image: string,
    name: string,
    // socialMedia: {
    //     type: string,
    //     link: string
    // }[],
    // graduations: string[],
    // role: string
}

interface InterfaceTeamBall{
    image: string,
    name: string
}

function createTeamViwerBalls(team:InterfaceTeam[]):InterfaceTeamBall[][]{
    let c_1:InterfaceTeam[] = []
    let c_2:InterfaceTeam[] = []
    let c_3:InterfaceTeam[] = []

    for (let i = (team.length - 1); i >= 0; i--) {
        if(c_1.length == 0){
            c_1.push(team[i])
        }else{
            if(c_2.length - c_1.length== 1){
                if(c_3.length - c_2.length == 1){
                    c_1.push(team[i])
                }else if(c_2.length == 0){
                    c_2.push(team[i])
                }else{
                    c_3.push(team[i])
                }
            }else{
                c_2.push(team[i])
            }
        }
    }

    return [c_3, c_2, c_1]
}

export default function TeamPage({ nameProject, messages }: TeamPageProps) {
    const [teamsBalls, setTeamsBalls] = useState<InterfaceTeamBall[][]>([])
    const [viewUser, setViewUser] = useState<InterfaceTeam>()
    const [founders, setFounders] = useState<InterfaceTeam[]>([])

    function viewTeam(i:number,j:number){
        setViewUser(teamsBalls[j][i])
    }


    useEffect(() => {
        const getTeamBall = createTeamViwerBalls([
            {image: "", name: "a"}, {image: "", name: "b"}, {image: "", name: "c"}, {image: "", name: "d"}, {image: "", name: "e"}, {image: "", name: "f"}, {image: "", name: "g"}, {image: "", name: "h"}, {image: "", name: "i"}
        ])
        setTeamsBalls(getTeamBall)
        setViewUser(getTeamBall[0][0])
    },[])
    return (
        <>
            <Navbar messages={messages.navbar} page="team" styleColor="#67839A" key={"team-Nav"} />
            <HeaderMinify style={{color: "#fff", textTransform: "uppercase"}} title={messages.team.titleHeader} background={"#262626"} key={"team-Headerrs"} />
            <section  className={styles.teamSection} id="team">
                <TextImageDescrition image={"messages.thematicNucleiSectionDescription.image"} form="stretch" direction="right">
                    <div className={styles.contentDescription}>
                        <h6 className={styles.titleContent} dangerouslySetInnerHTML={{ __html: "messages.thematicNucleiSectionDescription.title" }} />
                        <p className={styles.pContent} dangerouslySetInnerHTML={{ __html: "messages.thematicNucleiSectionDescription.p" }} />
                    </div>
                </TextImageDescrition>
            </section>
            <hr />
            <main className={styles.mainSection}>
                <h2 className={styles.titleMainSection} dangerouslySetInnerHTML={{__html: messages.team.FoundersTeamTitle}}/>
                <div>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                    >
                        {founders?.map((people:InterfaceTeam, index:number) => (
                            <SwiperSlide key={`${people.name}_${index}`}>
                                {/* <ShowPeople key={`${people.name}_${index}`} graduations={people.graduations} image={people.image} name={people.name} role={people.role} socialMedia={people.socialMedia} /> */}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </main>
            <section className={styles.sectionTeam}>
                <div className={styles.contentTitle}>
                    <h3>{messages.team.teamTitle}</h3>
                    <span>{messages.team.teamSubTitle}</span>
                </div>
                <div className={styles.contentTeam}>
                    <div className={styles.containerTeams}>

                        {teamsBalls?.map((column, index_c) => (
                            <div className={styles.column} style={{marginTop: `${index_c*75}px`}} key={`column-${index_c}`}>
                                {
                                    column?.map((team, index_t) => (
                                        <button onClick={() => viewTeam(index_t, index_c)} key={`ball-${index_c}-${index_t}`} title={team?.name} className={styles?.ball}><img src={team?.image} alt={team?.name} /></button>
                                    ))
                                }
                            </div>
                        ))}
                    </div>
                    <div className={styles.containerInformationTeam} key={`view-${viewUser?.name}`}>
                        <div className={styles.image}>
                            <img src={viewUser?.name} alt="" />
                        </div>
                        <span className={styles.name}>{viewUser?.name}</span>
                        <div className={styles.contentSocialMedia}>
                            <Link href=""><img src="/icons/instagram_icon.png" alt="" /></Link>
                            <Link href=""><img src="/icons/linkedin_icon.png" alt="" /></Link>
                        </div>
                        <div className={styles.contentGraduation}>
                            <span></span>
                        </div>
                        <div className={styles.contentFunction}>
                            <span></span>
                        </div>
                    </div>
                </div>
            </section>
            <hr />
            <section className={styles.sectionTransparency}>
                <h2 className={styles.title}>{messages.team.transparencyTitle}</h2>

                <div className={styles.content}>
                    <h3 className={styles.titleContent}>{messages.team.FundersTitle}</h3>
                    <TextImageDescrition key={`${"index"}-research`} image={"data.image"} direction={"data.direction" as "left" | "right"} form={"stretch"}>
                        <div className={`${styles.contentDescription}`}>
                            <div className={styles.contentTitleDescription}>
                                <span className={styles.titleNuclei}>{"data.nucleiTitle"}</span>
                                <h6 className={styles.titleContent} style={{color:  "data.color"}} dangerouslySetInnerHTML={{__html: "data.titleProject"}}/>
                            </div>

                            <p className={styles.pContent} dangerouslySetInnerHTML={{__html: "data.p"}}/>
                            <Link href={"data.link"}> <button className={styles.button} style={{backgroundColor: "data.color"}} title={messages.team.textButton}>{messages.team.textButton}</button> </Link>
                        </div>
                    </TextImageDescrition>
                </div>

                <div className={styles.content}>
                    <h3 className={styles.titleContent}>{messages.team.resourcesTitle}</h3>
                    <DynamicTable p="" title="" columnDefs={[]} rowData={[]} key={"DynamicTable-team"}/>
                </div>

                <div className={styles.content}>
                    <h3 className={styles.titleContent}>{messages.team.reportTitle}</h3>
                    <Docs docs={[]}/>
                </div>

            </section>
            <hr />
            <section className={styles.sectionContact}>
                <h2 className={styles.title}>{messages.team.contactTitle}</h2>

                <div className={styles.container}>
                    <div className={styles.content}>
                        <span className={styles.title}>E-mail da equipe</span>
                        <span className={styles.contact}>emaildaequipe@gmail.com</span>
                    </div>
                    <div className={styles.content}>
                        <span className={styles.title}>E-mail da equipe</span>
                        <span className={styles.contact}>emaildaequipe@gmail.com</span>
                    </div>
                    <div className={styles.content}>
                        <span className={styles.title}>E-mail da equipe</span>
                        <span className={styles.contact}>emaildaequipe@gmail.com</span>
                    </div>
                    <div className={styles.content}>
                        <span className={styles.title}>E-mail da equipe</span>
                        <span className={styles.contact}>emaildaequipe@gmail.com</span>
                    </div>
                </div>
            </section>
            <section className={styles.sectionDocs}>
                <h2 className={styles.title}>{messages.team.docsTitle}</h2>
                <Docs docs={[]}/>
            </section>

            <Footer messages={messages.footer} />
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const projects = ["motostudent", "fazenda4.0", "biotech", "smartcity"]; // 🔹 Adicione os projetos disponíveis aqui

    const paths = projects.map((project) => ({
        params: { nameProject: project },
    }));

    return { paths, fallback: "blocking" }; // 🔹 "blocking" gera páginas sob demanda, sem erro 404.
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
    const nameProject = params?.nameProject as string;

    const messages = {
        team: await getTranslations("team", locale || "pt"),
        footer: await getTranslations("footer", locale || "pt"),
        navbar: await getTranslations("navbar", locale || "pt"),
    };

    return {
        props: { nameProject, messages },
        revalidate: 60,
    };
};