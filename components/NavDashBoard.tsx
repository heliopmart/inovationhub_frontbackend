import Link from "next/link"
import style from "@/styles/components/NavDashBoard.module.scss"

interface LinkInterface{
    text: string,
    link: string,
    team?: boolean
}

export function NavDashBoard({links}:{links:any}){
    return(
        <nav className={style.ContainerNavBar}>
            <div className={style.header}>
                <Link href={"/"}> <h2>Hub de inovações |</h2> </Link>
                <Link href={"/dashboard#resume"}> <span>PAINEL</span> </Link>
            </div>
            
            <div className={style.content}>
                {
                    links?.map((link:LinkInterface, index:number) => {
                        if(link.team){
                            return (
                                <div key={`Link-Nav-${index}`} className={style.teamContent}>
                                    <Link href={`${link.link}`}>{link.text}</Link>
                                    <div className={style.team}>
                                        <Link href={""}>Equipe <b>MotoStudent</b></Link>
                                        <Link href={""}>Equipe <b>Fazenda 4.0</b></Link>
                                    </div>
                                </div>
                            )
                        }else{
                            return <Link key={`Link-Nav-${index}`} href={`${link.link}`}>{link.text}</Link>
                        }
                    })
                }
            </div>
        </nav>
    )
}
