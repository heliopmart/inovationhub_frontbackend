import Link from "next/link";
import styles from "@/styles/components/navbar.module.scss"; // Importa corretamente o CSS Module
import { useState } from "react";

interface NavigationText {
    title: string;
    href: string;
}

function Navigation({title, links, toggleMenu, menuState}:{title:string, links:NavigationText[], toggleMenu:(menuId:string) => void, menuState:string|null}) {
    return (
        <label className={styles.contentStrNavigation} onClick={() => toggleMenu(title)}>
            <span className={styles.navigationText}>{title}</span>
            <div className={styles.boxDetails} id={title} style={{display: menuState === title ? "flex" : "none"}}>
                {links?.map((link, index) => (
                    <Link href={link.href} key={`${index}_${link.title}`}>
                        <span className={styles.navDetais}>{link.title}</span>
                    </Link>
                ), "")}
            </div>
        </label>
    )
}

export default function Navbar({ messages }: { messages: any }) {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Função para alternar menus e desmarcar os outros
    const toggleMenu = (menuId: string) => {
        setActiveMenu(activeMenu === menuId ? null : menuId);
    };

    return (
        <nav id="navigation" className={styles.nav}>
            <div className={styles.nameProject}>
                <h1 className={styles.titleProject}>
                    Hub de inovações | <Link href="https://ufgd.edu.br">UFGD</Link>
                </h1>
            </div>
            <div className={styles.navigation}>
                <Navigation toggleMenu={toggleMenu} menuState={activeMenu} title="Sobre nós" links={[{title: "Sobre o projeto", href: "/aboutUs#aboutProject"}, {title: "Fundadores", href: "/aboutUs#founders"}, {title: "Responsáveis", href: "/aboutUs#responsible"}, {title: "UFGD", href: "/aboutUs#ufgd"}, {title: "Documentos", href: "/aboutUs#doc"}]} key={"AboutUs"}/>
                <Navigation  toggleMenu={toggleMenu} menuState={activeMenu} title="Núcleos Temáticos" links={[{title: "Sobre o projeto", href: "/aboutUs#aboutProject"}, {title: "Fundadores", href: "/aboutUs#founders"}, {title: "Responsáveis", href: "/aboutUs#responsible"}, {title: "UFGD", href: "/aboutUs#ufgd"}, {title: "Documentos", href: "/aboutUs#doc"}]} key={"AboutUs"}/>
                <Navigation  toggleMenu={toggleMenu} menuState={activeMenu} title="Soluções" links={[{title: "Sobre o projeto", href: "/aboutUs#aboutProject"}, {title: "Fundadores", href: "/aboutUs#founders"}, {title: "Responsáveis", href: "/aboutUs#responsible"}, {title: "UFGD", href: "/aboutUs#ufgd"}, {title: "Documentos", href: "/aboutUs#doc"}]} key={"AboutUs"}/>
                <Navigation  toggleMenu={toggleMenu} menuState={activeMenu} title="Estruturação" links={[{title: "Sobre o projeto", href: "/aboutUs#aboutProject"}, {title: "Fundadores", href: "/aboutUs#founders"}, {title: "Responsáveis", href: "/aboutUs#responsible"}, {title: "UFGD", href: "/aboutUs#ufgd"}, {title: "Documentos", href: "/aboutUs#doc"}]} key={"AboutUs"}/>
                <Navigation  toggleMenu={toggleMenu} menuState={activeMenu} title="Parceiros" links={[{title: "Sobre o projeto", href: "/aboutUs#aboutProject"}, {title: "Fundadores", href: "/aboutUs#founders"}, {title: "Responsáveis", href: "/aboutUs#responsible"}, {title: "UFGD", href: "/aboutUs#ufgd"}, {title: "Documentos", href: "/aboutUs#doc"}]} key={"AboutUs"}/>
            </div>
            <div className={styles.userAction}>
                <span className={styles.loginText}>Login</span>
                <button className={`${styles.buttonRegistre} ${styles.registreText}`}>
                    Inscrever-se
                </button>
            </div>
        </nav>
    );
}
