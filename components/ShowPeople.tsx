import Link from 'next/link'
import style from '@/styles/components/ShowPeople.module.scss'

interface InterfaceShowPeople{
    image: string,
    name: string,
    socialMedia: {
        type: string,
        link: string
    }[],
    graduations: string[],
    role: string,
    roleText?: string
}

const selectSocialMediaImage = (type:string) => {
    switch(type){
        case "instagram":
            return "/icons/instagram_icon.png"
        case "linkedin": 
            return "/icons/linkedin_icon.png"
        case "resume":
            return "/icons/ufgd_icon.png"
        default:
            return "/icons/instagram_icon.png"
    }
}

export function ShowPeople({image, name, socialMedia, graduations, role, roleText = "do Hub de inovações"}:InterfaceShowPeople){
    return (
        <div className={style.content}>
            <div className={style.image}>
                <img src={image} alt={image} />
            </div>
            <span className={style.name}>{name}</span>
            <div className={style.contentSocialMedia}>
                {socialMedia?.map((social, index) => (
                    <Link href={social.link} key={`${social.type}_${index}_${role}`}><img src={selectSocialMediaImage(social.type)} alt="Social Media" /></Link>
                ))}
            </div>
            <div className={style.contentGraduation}>
                {graduations?.map((graduation:string, index:number) => (
                    <span key={`${graduation}_${index}_${role}`}>{graduation}</span>
                ))}
            </div>
            <div className={style.role}><span>{role} {roleText}</span></div>
        </div>
    )
}