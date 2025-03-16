import Link from 'next/link'
import style from "@/styles/components/Event.module.scss"

interface InterfaceEvent{
    title: string,
    p: string,
    local: {
        local: string,
        time: string
    },
    linkTitle: string,
    link: string
}

export function Event({link,local,p,linkTitle,title}:InterfaceEvent){
    return (
        <div className={style.event}>
            <span className={style.titleEvent}>{title}</span>
            <p className={style.p}>{p}</p>
            <span className={style.textLocalTime}>{local.local} | <i>{local.time}</i></span>
            <Link href={link}> <button title={linkTitle}>{linkTitle}</button> </Link>
        </div>
    )
}