import Link from "next/link";
import styles from "@/styles/components/navbar.module.scss"; // Importa corretamente o CSS Module
import { useState, useEffect } from "react";

interface NavigationText {
    title: string;
    href: string;
}

interface NavigationProps {
    title: string;
    links: NavigationText[];
}

interface NavigationMinify{
    nav: {
        title: string,
        links: NavigationText[]
    }[],
    IsOpen: boolean
    toggleMenu:(menuId:string) => void, 
    menuState:string|null
    loginText: string
    registreText: string
    styleColor?: string
}

function Navigation({title, links, toggleMenu, menuState}:{title:string, links:NavigationText[], toggleMenu:(menuId:string) => void, menuState:string|null}) {
    return (
        <label className={styles.contentStrNavigation} >
            <span className={`${styles.navigationText} ${menuState === title ? styles.navigationTextselect : ""}`} onClick={() => toggleMenu(title)}>{title}</span>
            <div className={styles.boxDetails} id={title} style={{display: menuState === title ? "flex" : "none"}}>
                {links?.map((link, index) => (
                    <Link href={`${link.href}`} key={`${index}_${link.title}`}>
                        <span className={styles.navDetais}>{link.title}</span>
                    </Link>
                ), "")}
            </div>
        </label>
    )
}

function NavigationMinify({nav, toggleMenu, menuState, IsOpen,styleColor, registreText, loginText}:NavigationMinify) {
    return (
        <div className={styles.navigationMinify} style={{display: IsOpen ? "flex" : "none"}}>
            {
                nav?.map((nav, index) => (
                    <>
                        <span key={`${index}-${nav.title}`} className={`${styles.navigationText} ${menuState === nav.title ? styles.navigationTextselect : ""}`} onClick={() => toggleMenu(nav.title)}>{nav.title}</span>
                        <div key={`${index}-${nav.title}-menu`} className={styles.boxDetails} id={nav.title} style={{display: menuState === nav.title ? "flex" : "none"}} >
                            {nav.links?.map((link, index) => (
                                <Link href={`${link.href}`} key={`${index}_${link.title}`}>
                                    <span className={styles.navDetais}>{link.title}</span>
                                </Link>
                            ), "")}
                        </div>
                    </>
                ))
            }
            
            <Link href={"/login"}><button className={`${styles.buttonLogin}`}>{loginText}</button></Link>
            <Link href={"/register"}><button className={`${styles.buttonRegistre} ${styles.registreText}`} style={{backgroundColor: styleColor ? styleColor : ""}}>{registreText}</button></Link>
        </div>
    )
}


export default function Navbar({ messages, page, styleColor }: { messages: any, styleColor?: string, page?:string }) {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [menuMinify, setMenuMinify] = useState<boolean>(false);

    
    // Função para alternar menus e desmarcar os outros
    const toggleMenu = (menuId: string) => {
        setActiveMenu(activeMenu === menuId ? null : menuId);
    };

    useEffect(() => {
        if (menuMinify) {
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "auto";
        }

        return () => {
            document.body.style.overflowY = "auto"; // Garante que ao desmontar, o estilo é restaurado
        };
    }, [menuMinify]);

    return (
        <div className={styles.content}>
            <nav id="navigation" className={styles.nav}>
                <div className={styles.nameProject}>
                    <h1 className={styles.titleProject}>
                        <Link href={"/"}>{messages?.nameProject}</Link> | <Link href="https://ufgd.edu.br"><b>UFGD</b></Link>
                    </h1>
                </div>
                <div className={styles.navigation}>
                    {
                        messages?.nav?.map((nav:NavigationProps) => (
                            <Navigation toggleMenu={toggleMenu} menuState={activeMenu} title={nav.title} links={nav.links} key={nav.title}/>

                        ), "")
                    }
                </div>
                <div className={styles.userAction}>
                    <Link href={"/login"}><span className={styles.loginText}>{messages.loginText}</span></Link>
                    <Link href={"/register"}><button className={`${styles.buttonRegistre} ${styles.registreText}`} style={{backgroundColor: styleColor ? styleColor : ""}}>
                        {messages.registreText}
                    </button></Link>
                </div>
            </nav>

            <div className={styles.containerNavAndMenu}>
                <nav id="navigationMinify" className={styles.navMinify}>
                    <div className={styles.nameProject}>
                        <h1 className={styles.titleProject}>
                            <Link href={"/"}>{messages?.nameProject}</Link> | <Link href="https://ufgd.edu.br"><b>UFGD</b></Link>
                        </h1>
                    </div>
                    <button title="Open" className={styles.menuNavigation} onClick={() => setMenuMinify(!menuMinify)}><div/></button>
                </nav>
                <NavigationMinify styleColor={styleColor} IsOpen={menuMinify} loginText={messages.loginText} registreText={messages.registreText} toggleMenu={toggleMenu} nav={messages.nav} menuState={activeMenu}  key={"navigationMinify"}/>
            </div>
        </div>
    );
}
