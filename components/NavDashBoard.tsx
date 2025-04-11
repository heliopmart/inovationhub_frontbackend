import Link from "next/link"
import {useEffect, useState} from "react"
import style from "@/styles/components/NavDashBoard.module.scss"
import {exitAccount, getUserTeams} from "@/services/function.navdashboard"
import {NavTeamProps} from "@/types/interfaceClass"

interface LinkInterface{
    text: string,
    link: string,
    team?: boolean
}

async function exit(){
    if(await exitAccount()){
        window.location.href = "/"
    }
}

export function NavDashBoard({links}:{links:any}){
    const [userTeams, setUserTeam] = useState<NavTeamProps[]>()

    useEffect(() => {
        async function get(){
            const requestTeams = await getUserTeams()
            if(!requestTeams) return

            setUserTeam(requestTeams as NavTeamProps[])
        }
        get()
    },[])

    return(
        <nav className={style.ContainerNavBar}>
            <div className={style.header}>
                <Link href={"/"}> <h2>Hub de inovações |</h2> </Link>
                <Link href={"/dashboard/resume"}> <span>PAINEL</span> </Link>
            </div>
            
            <div className={style.content}>
                {
                    links?.map((link:LinkInterface, index:number) => {
                        if(link.team){
                            return (
                                <div key={`Link-Nav-${index}`} className={style.teamContent}>
                                    <Link href={`${link.link}`}>{link.text}</Link>
                                    <div className={style.team}>
                                        {
                                            userTeams?.map((team, index_team) => (
                                                <Link href={`/dashboard/team/${team.team.name}`} key={`${index}-${index_team}-Team-NAV`}>Equipe <b style={{color: team.team.color || "#1a1a1a"}}>{team.team.name}</b></Link>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        }else{
                            return <Link key={`Link-Nav-${index}`} href={`${link.link}`}>{link.text}</Link>
                        }
                    })
                }
                <span className={style.exit} onClick={(e) => {exit()}} key={`link-exit`} >Sair</span>
            </div>
        </nav>
    )
}
