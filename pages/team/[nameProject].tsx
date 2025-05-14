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

import {getTeam} from '@/services/function.team'
import {TeamComplete, InvestorTeamCompleat} from "@/types/interfacesSql"

import {NormalizeType, NormalizeStatus, NormalizeRoleTeam} from "@/lib/normalizeInformationToFront"

interface TeamPageProps {
    nameProject: string;
    messages: any;
}


interface InterfaceMember{
    id: string,
    name: string,
    type: string,
    color: string,
    image: string
    graduations: string[]
    role: string,
    socialMedia: {
        type: string,
        link: string
    }[]
}


interface InterfaceTeamBall{
    image: string,
    name: string
}

interface GetMembersAndFoundersReturn{
    members: InterfaceMember[],
    founders: InterfaceMember[],
    coordinator: InterfaceMember[],
    membersBalls: InterfaceMember[]
}

interface InterfaceTable{
    columns: any
    rows: any[]
}

function createTeamViwerBalls(team:InterfaceMember[]):InterfaceMember[][]{
    let c_1:InterfaceMember[] = []
    let c_2:InterfaceMember[] = []
    let c_3:InterfaceMember[] = []

    for (let i = (team?.length - 1); i >= 0; i--) {
        const isMemberAlreadyInTeam = verifyUserIsAdding(team[i])

        if(!isMemberAlreadyInTeam){
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

        function verifyUserIsAdding(user: InterfaceMember): boolean {
            const all = [...c_1, ...c_2, ...c_3];
            return all.some(member => member.name === user.name);
        }
    }

    return [c_3, c_2, c_1].filter(arr => arr.length > 0);
}

function getMembersAndFounders(team:TeamComplete):GetMembersAndFoundersReturn{
    const teamMembers = team.members
    const founders = teamMembers
        ?.map((member) => {
            if(member.role == "founder" || member.role == "leader"){
                return {...member.member, role: member.roleTeam}
            }
        })
        ?.filter((member) => member !== undefined);

    const coordinator = teamMembers
        ?.map((member) => {
            if(member.role == "coordinator"){
                return {...member.member, role: member.roleTeam}
            }
        })
        ?.filter((member) => member !== undefined);

    const members = teamMembers
        ?.map((member) => {
            if(member.role == "member"){
                return {...member.member, role: member.roleTeam}
            }
        })
        ?.filter((member) => member !== undefined);

    return {founders: founders as InterfaceMember[], coordinator: coordinator as InterfaceMember[], members: members as InterfaceMember[], membersBalls: teamMembers?.map(member => ({...member.member, role: member.roleTeam}))}
}

const setDirectionForComponent = (data:InvestorTeamCompleat[] | undefined):InvestorTeamCompleat[] => {
    if(data === undefined){
        return []
    }
    
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

export default function TeamPage({ nameProject, messages }: TeamPageProps) {
    const [team, setTeam] = useState<TeamComplete>()
    const [teamsBalls, setTeamsBalls] = useState<InterfaceTeamBall[][]>([])
    const [viewUser, setViewUser] = useState<InterfaceMember>()
    const [founders, setFounders] = useState<InterfaceMember[]>([])
    const [coordinators, setCoordinators] = useState<InterfaceMember[]>([])
    const [table, setTable] = useState<InterfaceTable>()
    const [docs, setDocs] = useState<any>()
    const [arts, setArts] = useState<any>()

    function viewTeam(i:number,j:number){
        setViewUser(teamsBalls[j][i] as InterfaceMember)
    }

    useEffect(() => {
        async function get(){
            const resTeam = await getTeam(nameProject)
            if(resTeam.st && resTeam.value != null){
                const teamMembers = getMembersAndFounders(resTeam.value)
                const getTeamBall = createTeamViwerBalls(teamMembers.membersBalls)
                setTeam(resTeam.value);
                setFounders(teamMembers.founders)
                setCoordinators(teamMembers.coordinator)
                setTeamsBalls(getTeamBall)
                setViewUser(getTeamBall[0][0])
                setTable({columns: resTeam.table, rows: resTeam.value.resources?.map((rs) => rs.resource)})
                setDocs(resTeam.value.docs.map((doc) => (
                    {
                        title: doc.name,
                        files: [{
                            name: doc?.files?.name || "",
                            link: doc?.files?.download || ""
                        }]
                    }
                )))         
                setArts([{
                    title: "ARTs e versinamento",
                    files: resTeam.value.arts.map((art) => (
                        {
                            name: `ART ${art.files.name} | ${NormalizeType(art.files.type)} | ${NormalizeStatus(art.files.status)}` || "",
                            link: art?.files.linkDoc || ""
                        }
                    ))
                }])
            }
        }
        get()

    },[])
    return (
        <>
            <Navbar messages={messages.navbar} page="team" styleColor="#67839A" key={"team-Nav"} />
            <HeaderMinify style={{color: "#fff", textTransform: "uppercase"}} title={`Equipe ${team?.name || ""}`} background={"#262626"} key={"team-Headerrs"} />
            <section  className={styles.teamSection} id="team">
                <TextImageDescrition image={team?.image} form="stretch" direction="right">
                    <div className={styles.contentDescription}>
                        <h6 className={styles.titleContent} dangerouslySetInnerHTML={{ __html: `Equipe ${team?.name}` }} />
                        <p className={styles.pContent} dangerouslySetInnerHTML={{ __html: team?.description ? team.description : "" }} />
                    </div>
                </TextImageDescrition>
                <TextImageDescrition image={"/assets/nuclei_image.webp"} form="stretch" direction="left">
                    <div className={styles.contentDescription}>
                        <h6 className={styles.titleContent} dangerouslySetInnerHTML={{ __html: `Como contribuimos com a inovação?` }} />
                        <p className={styles.pContent} dangerouslySetInnerHTML={{ __html: team?.description_innovation ? team.description_innovation : "" }} />
                    </div>
                </TextImageDescrition>
            </section>
            <hr />
            <main className={styles.mainSection}>
                <h2 className={styles.titleMainSection} dangerouslySetInnerHTML={{__html: messages.team.FoundersTeamTitle}}/>
                <div>
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                    >
                        {founders?.map((people:InterfaceMember, index:number) => (
                            <SwiperSlide key={`${people.name}_${index}`}>
                                <ShowPeople key={`${people.name}_${index}`} graduations={people.graduations} image={people.image} name={people.name} role={people.role} socialMedia={people.socialMedia} roleText={`da equipe ${team?.name}`}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </main>
            <section className={styles.mainSection}>
                <h2 className={styles.titleMainSection} dangerouslySetInnerHTML={{__html: messages.team.CoorTeamTitle}}/>
                <div>
                    {coordinators?.length == 0 ? (
                        <span className={styles.warning}> Este projeto não tem coordenadores ainda. </span>
                    ):(
                        <Swiper
                            modules={[Pagination]}
                            spaceBetween={10}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                        >
                            {coordinators?.map((people:InterfaceMember, index:number) => (
                                <SwiperSlide key={`${people.name}_${index}`}>
                                    <ShowPeople key={`${people.name}_${index}`} graduations={people.graduations} image={people.image} name={people.name} role={people.role} socialMedia={people.socialMedia} roleText={`da equipe ${team?.name}`}/>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </section>
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
                                        <button onClick={() => viewTeam(index_t, index_c)} key={`ball-${index_c}-${index_t}`} title={team?.name} className={styles?.ball} style={{backgroundImage: `url("${team?.image}")`}}/>
                                    ))
                                }
                            </div>
                        ))}
                    </div>
                    <div className={styles.containerInformationTeam} key={`view-${viewUser?.name}`}>
                        <div className={styles.image}>
                            <img src={viewUser?.image} alt="Image" />
                        </div>
                        <span className={styles.name}>{viewUser?.name}</span>
                        <div className={styles.contentSocialMedia}>
                            <Link href={`${viewUser?.socialMedia[0].link}`}><img src="/icons/instagram_icon.png" alt="" /></Link>
                            <Link href={`${viewUser?.socialMedia[1].link}`}><img src="/icons/linkedin_icon.png" alt="" /></Link>
                        </div>
                        <div className={styles.contentGraduation}>
                            {
                                viewUser?.graduations?.map((txt: string) => (
                                    <span key={`${viewUser.name}-${txt}`}>{txt}</span>
                                ))
                            }
                        </div>
                        <div className={styles.contentFunction}>
                            <span>{NormalizeRoleTeam(viewUser?.role || "")} da equipe {team?.name}</span>
                        </div>
                    </div>
                </div>
            </section>
            <hr />
            <section className={styles.sectionTransparency}>
                <h2 className={styles.title}>{messages.team.transparencyTitle}</h2>

                <div className={styles.content}>
                    <h3 className={styles.titleContent}>{messages.team.FundersTitle}</h3>
                    {
                        setDirectionForComponent(team?.investors)?.map((investor, index) => (
                            <TextImageDescrition key={`${index}-investor-${investor.investor.name}-${team?.name}`} image={investor.investor.image} direction={investor.direction as "left" | "right"} form={"stretch"}>
                                <div className={`${styles.contentDescription}`}>
                                    <div className={styles.contentTitleDescription}>
                                        <span className={styles.titleNuclei}>{investor.investor.descriptionInvestment}</span>
                                        <h6 className={styles.titleContent} style={{color:  investor.investor.color}} dangerouslySetInnerHTML={{__html: investor.investor.name}}/>
                                    </div>

                                    <p className={styles.pContent} dangerouslySetInnerHTML={{__html: investor.investor.description}}/>
                                    <Link href={`${investor.investor.link}`}> <button className={styles.button} style={{backgroundColor: investor.investor.color}} title={messages.team.textButton}>{messages.team.textButton}</button> </Link>
                                </div>
                            </TextImageDescrition>
                        ))
                    }

                </div>

                <div className={styles.content}>
                    <h3 className={styles.titleContent}>{messages.team.resourcesTitle}</h3>
                    <DynamicTable p="" title="" columnDefs={table?.columns} rowData={table?.rows ? table.rows : []} key={"DynamicTable-team"}/>
                </div>

                <div className={styles.content}>
                    <h3 className={styles.titleContent}>{messages.team.reportTitle}</h3>
                    <Docs docs={arts}/>
                </div>

            </section>
            <hr />
            <section className={styles.sectionContact}>
                <h2 className={styles.title}>{messages.team.contactTitle}</h2>

                <div className={styles.container}>
                    {
                        team?.contact.map((contact, index) => (
                            <div className={styles.content} key={`email_${index}_${contact.role}`}>
                                <span className={styles.title}>E-mail {contact.role} da equipe</span>
                                <span className={styles.contact}>{contact.email}</span>
                            </div>
                        ))
                    }
                </div>
            </section>
            <section className={styles.sectionDocs}>
                <h2 className={styles.title}>{messages.team.docsTitle}</h2>
                <Docs docs={docs}/>
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