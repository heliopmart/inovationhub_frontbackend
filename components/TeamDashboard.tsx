import Link from "next/link"
import style from "@/styles/components/TeamDashboard.module.scss"

interface TeamProps {
    name: string;
    description: string;
    color: string;
    teamIdName: string
}

export function MyTeam({name, description, color, teamIdName}:TeamProps){
    return (
        <div className={`${style.container}`}>
            <span> Equipe <b style={{color: color}}>{name}</b></span>
            <p dangerouslySetInnerHTML={{__html: description}}/>
            <div className={style.content}>
                <Link href={`team/${teamIdName}`}>
                    <button className={style.button} title="access">Acessar Equipe</button>
                </Link>
            </div>
        </div>
    )
}

export function OthersTeam({name, description, color, teamIdName}:TeamProps){
    return (
        <div className={`${style.container} ${style.othersTeam}`}>
            <span> Equipe <b style={{color: color}}>{name}</b></span>
            <p dangerouslySetInnerHTML={{__html: description}}/>
            <div className={style.content}>
                <Link href={`/team/${teamIdName}`}>
                    <button className={style.buttonShowMore} title="know more">Saber mais</button>
                </Link>
                <Link href={`/dashboard/team/${name}/inscription`}>
                    <button className={style.buttonRegistre} title="Sign up">Inscrever-se</button>
                </Link>
            </div>
        </div>
    )
}