import Link from "next/link"
import style from "@/styles/components/NucleiComponent.module.scss"

interface InterfaceNucleiComponent{
    nucleiName: string,
    p: string,
    roles: {
        director: {
            textRole: string
            name: string,
            email: string,
            tell: string
        },
        coordinator: {
            textRole: string,
            name: string, 
            email: string,
            tell: string
        }
    },
    imageBanner: string,
    color_1: string,
    color_2: string
}

export function NucleiComponent({nucleiName, p, roles, color_1, color_2, imageBanner}: InterfaceNucleiComponent){
    return (
        <section  className={style.section}>
            <h3>Núcleo temático de <b style={{color: color_1}}>{nucleiName}</b></h3>
            <p dangerouslySetInnerHTML={{__html: p}}/>
            <div  className={style.sectionRoles}>
                <div className={style.containerRole}>
                    <div className={style.contentRole} style={{backgroundColor: color_1}}>
                        <span>{roles?.director.textRole}</span>
                    </div>
                    <div className={style.contentInformations}>
                        <span className={style.name}>{roles.director.name} | <b style={{color: color_1}}>Diretor do núcleo</b></span>
                        <span className={style.email}>E-mail: <Link href={roles.director.email}> {roles.director.email} </Link></span>
                        <span className={style.tell}>Telefone: {roles.director.tell}</span>
                    </div>
                </div>
                <div className={style.containerRole}>
                    <div className={style.contentRole} style={{backgroundColor: color_2}}>
                        <span>{roles.coordinator.textRole}</span>
                    </div>
                    <div className={style.contentInformations}>
                        <span className={style.name}>{roles.coordinator.name} | <b style={{color: color_2}}>Coordenador docente do núcleo</b></span>
                        <span className={style.email}>E-mail: <Link href={roles.coordinator.email}> {roles.coordinator.email} </Link></span>
                        <span className={style.tell}>Telefone: {roles.coordinator.tell}</span>
                    </div>
                </div>
            </div>
            <div className={style.contentImage}>
                <img src={imageBanner} alt={imageBanner} />
            </div>
        </section>
    )
}