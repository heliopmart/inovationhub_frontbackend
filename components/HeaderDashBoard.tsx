import styles from "@/styles/components/HeaderDashBoard.module.scss"

export function HeaderDashBoard({}:{}){
    return (
        <header className={styles.headerDashboard}>
            <div className={styles.contentUser}>
                <span>Teste </span>
                <img src="" alt="" />
            </div>
            <nav>
                <div className={styles.back}>
                    <button className={styles.arrowBack} title="Voltar"><img src="/icons/arrow.svg" alt="<---" /></button>
                    <span>Painel - Resumo</span>
                </div>
                <div className={styles.warningContent}>
                    <span>Local para avisos rápidos e sincronos</span>
                </div>
            </nav>
        </header>
    )
}