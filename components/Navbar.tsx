import Link from "next/link";
import styles from "@/styles/components/navbar.module.scss"; // Importa corretamente o CSS Module
import { useState } from "react";

interface NavigationText {
    title: string;
    href: string;
}

interface NavigationProps {
    title: string;
    links: NavigationText[];
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

export default function Navbar({ messages, page, styleColor }: { messages: any, styleColor?: string, page?:string }) {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Função para alternar menus e desmarcar os outros
    const toggleMenu = (menuId: string) => {
        setActiveMenu(activeMenu === menuId ? null : menuId);
    };

    return (
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
                <span className={styles.loginText}>{messages.loginText}</span>
                <button className={`${styles.buttonRegistre} ${styles.registreText}`} style={{backgroundColor: styleColor ? styleColor : ""}}>
                    {messages.registreText}
                </button>
            </div>
        </nav>
    );
}
