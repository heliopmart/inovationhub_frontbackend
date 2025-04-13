import { GetStaticProps, GetStaticPaths } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import withAuth from '@/hoc/withAuth';
import {authUser} from "@/types/interfaceClass"

import {NavDashBoard} from "@/components/NavDashBoard"
import {HeaderDashBoard} from "@/components/HeaderDashBoard"

import {ComponentUsersToLeaderART} from "@/components/ComponentDashboard"
import {DefaultInput, SelectInput, FileInput} from "@/components/Input"

import styleLoading from '@/styles/components/Loading.module.scss'
import styles from '@/styles/pages/actionsTeam.module.scss' 

import {getTeamMember, getTeamMemberForArtLeader, getTeamCoordinatorForArt} from "@/services/function.dashboard.team"
import {callCreateArt} from "@/services/function.create.art"
import {UserToLeaderProps} from "@/types/interfaceClass"
import {CoordinatorToArtProps} from "@/types/interfaceDashboardSql"

interface TeamInformationsProps{
    id: string,
    name:string,
    color: string
}

const types = ["Modificação", "Pesquisa", "Criação", "Cancelamento", "Design Interativo"]
const normalizeTypes = {"Modificação": "modification", "Pesquisa": "research", "Criação": "creation", "Cancelamento": "cancellation", "Design Interativo": "interactive design"}

function DashboardArt({ nameTeam, messages, authUser }: { messages: any, nameTeam: string, authUser: authUser}){
    const router = useRouter();
    const [information, setInformation] = useState<TeamInformationsProps>()
    const [loading, setLoading] = useState<boolean>(false)
    
    const [userToLeader, setUserToLeader] = useState<UserToLeaderProps[]>()
    const [coordinators, setCoordinators] = useState<CoordinatorToArtProps[]>()
    
    
    const [userToLeaderSearcher, setUserToLeaderSearcher] = useState<UserToLeaderProps[]>()
    const [searchUser, setSearchUser] = useState<string>("")
    
    const [InputArtName, setInputArtName] = useState<string>("")
    const [InputDate, setInputDate] = useState<string>("")
    const [InputCoordinator, setInputCoordinator] = useState<string>("")
    const [InputLeader, setInputLeader] = useState<string>("")
    const [InputType, setInputType] = useState<string>("")
    const [InputFile, setInputFile] = useState<any>()

    function downloadDoc(linkDoc:string){

    }

    function selectLeader(userId:string){
        setInputLeader(userId)
    }

    async function sendArt(){
        const _type = normalizeTypes[InputType as keyof typeof normalizeTypes] || "";

        if(!_type || !InputArtName || !InputDate || !InputCoordinator || !InputLeader || !InputFile){
            alert("Preencha todos os campos")
            return
        }

        const data = {
            name: InputArtName,
            type: _type,
            limitDate: InputDate,
            coordinatorId: coordinators?.find((user) => user.name === InputCoordinator)?.id,
            leaderId: InputLeader,
            file: InputFile
        }    
        
        const request = await callCreateArt(data, authUser, information?.id as string)
        if(request){
            alert("ART criada com sucesso")
            router.push(`/dashboard/team/${nameTeam}`)
        }else{
            alert("Erro ao criar ART")
        }
    }

    const search = (txt:string) => {
        setSearchUser(txt)

        if(txt.length > 0){
            const _search = userToLeader?.filter((user) => user.name.toLowerCase().includes(txt.toLowerCase()))
            setUserToLeaderSearcher(_search)
        }
    }

    useEffect(() => {
        async function get(){
            setLoading(true)
            const {team, teamMember} = await getTeamMember(authUser, nameTeam);
            
            if((teamMember.roleTeam !== "leader")){
                router.push("/dashboard/team")
            }

            const requestTeamMember = await getTeamMemberForArtLeader(teamMember.teamId)
            const requestTeamCoordinator = await getTeamCoordinatorForArt(teamMember.teamId)

            if(requestTeamMember.st)
                setUserToLeader(requestTeamMember.value)

            if(requestTeamCoordinator.st)
                setCoordinators(requestTeamCoordinator.value)
            
            setInformation(team as TeamInformationsProps)
            setLoading(false)
        }
        get()
    },[])

    return (
        <section className={styles.section}>
            <div className={styles.menuContent}>
                <NavDashBoard links={messages.links.links}/>
            </div>
            <div className={styles.paintContent}>
                <HeaderDashBoard imageUser={authUser.user.image} nameUser={authUser.user.name} key={"Header-ART-Team"} nameTeam={nameTeam}/>
                <div className={styles.container}>
                    <section className={styles.sectionContent}>
                        <span className={styles.TitleSection}>Equipe <b style={{color: information?.color}}>{nameTeam}</b></span>
                        
                        {
                            loading ? (
                                <div className={styleLoading.containerLoading}>
                                    <span>Authenticando Usuário</span>
                                </div>
                            ) : (
                                <>
                                    <span className={styles.titleContent}>Requisição de ART</span>
                        
                                    <form className={styles.contentInputs}>
                                        <DefaultInput minLength={10} placeholder="Nome da ART" returnValue={(e) => {setInputArtName(e)}} text="Nome da ART" type="text" value={InputArtName} key={"key-art-name"}/>
                                        <SelectInput courses={types} returnValue={(e) => {setInputType(e)}} text="Tipo de ART" value={InputType} key={"key-report-type"}/>
                                        <FileInput returnValue={(e: File | null) => {setInputFile(e)}} text="Documento" key={"key-art-doc"}/>
                                        <SelectInput courses={coordinators?.map((user) => user.name) || []} returnValue={(e) => {setInputCoordinator(e)}} text="Coordenador Alocado" value={InputCoordinator} key={"key-art-coordinator"}/>
                                        
                                        <div className={styles.contentUserToLeader}>
                                            <DefaultInput minLength={10} placeholder="Pesquisar" returnValue={(e) => {search(e)}} text="Lider Alocado" type="text" value={searchUser} key={"key-art-leader"}/>
                                            <ComponentUsersToLeaderART data={searchUser.length > 0 ? userToLeaderSearcher || [] : userToLeader || []} downloadDoc={downloadDoc} selectLeader={selectLeader} key={"member-to-leader-component"}/>
                                        </div>
                                        
                                        <DefaultInput minLength={1} placeholder="Data limite para implementação" returnValue={(e) => {setInputDate(e)}} text="Data limite para implementação" type="date" value={InputDate} key={"key-art-date"}/>
                                        
                                        <button className={styles.buttonForm} title="Send" type="button" onClick={() => {sendArt()}}>Enviar</button>
                                    </form>
                                </>
                            )
                        }

                        
                    </section>
                </div>
            </div>
        </section>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [{ params: { nameTeam: "default" } }],
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
    const nameTeam = params?.nameTeam as string;

    const messages = {
        links: await getTranslations("NavDashBoard", locale || "pt")
    };

    return {
        props: { nameTeam, messages},
        revalidate: 60,
    };
};

export default withAuth(DashboardArt);