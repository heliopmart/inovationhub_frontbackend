import style from "@/styles/components/Banner.module.scss"

export function Banner({text, color}: {text: string, color: string}){
    return(
        <section className={style.banner} style={{backgroundColor: color}}>
            <span dangerouslySetInnerHTML={{__html: text}}/>
        </section>
    )
}