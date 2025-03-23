import Link from "next/link";
import style from "@/styles/components/Footer.module.scss";
interface InterfaceLiks{
    text: string,
    url: string
}

export default function Footer({ messages }: { messages: any }) {
    return (
        <>
        {messages.footer ? (
            <footer className={style.footer}>
                <div className={style.contentFlexFooter}>
                    <div className={style.contentInformation}>
                        <div className={style.hubIcon}>
                            <img src={"/icons/innovationHub_icon.svg"} alt="hub de inovações" />
                        </div>
                        <div className={style.contentSocialMedia}>
                            <Link href={""} target="_blank" rel="noopener noreferrer"><button title="Instagram" className={style.buttonSocialMedia}><img src={"/icons/instagram_icon.png"} alt="" /></button></Link>
                            <Link href={""} target="_blank" rel="noopener noreferrer"><button title="TikTok" className={style.buttonSocialMedia}><img src={"/icons/tiktok_icon.png"} alt="" /></button></Link>
                            <Link href={""} target="_blank" rel="noopener noreferrer"><button title="LinkedIn" className={style.buttonSocialMedia}><img src={"/icons/linkedin_icon.png"} alt="" /></button></Link>
                            <Link href={""} target="_blank" rel="noopener noreferrer"><button title="Discord" className={style.buttonSocialMedia}><img src={"/icons/discord_icon.png"} alt="" /></button></Link>
                            <Link href={"https://ufgd.edu.br"} target="_blank" rel="noopener noreferrer"><button title="UFGD" className={style.buttonSocialMedia}><img src={"/icons/ufgd_icon.png"} alt="" /></button></Link>
                        </div>
                        <button title="E-mail" className={style.buttonEmail}>hubdeinovacoesufgd@gmail.com</button>
                    </div>

                    <div className={style.contentSiteMap}>
                        <div className={style.contentPages}>
                            <span className={style.titlePages}>{messages.footer.content_1.title}</span>
                            
                            {
                                messages.footer.content_1.links.map((item: InterfaceLiks, index: number) => (
                                    <Link href={item.url} key={`${index}-${item.text}`} >
                                        <span className={style.textLinkPages}>{item.text}</span>
                                    </Link>
                                ))
                            }
                        </div>
                        <div className={style.contentPages}>
                            <span className={style.titlePages}>{messages.footer.content_2.title}</span>
                            
                            {
                                messages.footer.content_2.links.map((item: InterfaceLiks, index: number) => (
                                    <Link href={item.url} key={`${index}-${item.text}`} >
                                        <span className={style.textLinkPages}>{item.text}</span>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className={style.contentDown}>
                    <span className={style.copywriter}>© 2025 UFGD | Projetos pertencem à UFGD e suas equipes | Todos os direitos reservados.</span>
                    <Link href={""} target="_blank" rel="noopener noreferrer"><span className={style.copywriter}>Criado por <i>Hélio Martins</i></span></Link>
                </div>
            </footer>
        ):""}
        </>
    )
}