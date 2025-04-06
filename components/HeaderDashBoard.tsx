import { useRouter } from 'next/router';
import styles from "@/styles/components/HeaderDashBoard.module.scss";

interface HeaderDashBoardProps {
    nameUser?: string,
    imageUser?: string,
    nameTeam?: string;
    warning?: {
        message: string;
        display: boolean;
    }
}

export function HeaderDashBoard({imageUser,nameTeam,nameUser,warning}:HeaderDashBoardProps) {
    const router = useRouter();

    const handleBack = () => {
        if (router.asPath !== '/') {
            router.back();
        } else {
            router.push('/');
        }
    };

    const getDynamicPath = () => {
        const pathSegments = router.pathname.split('/').filter(Boolean);
    
        return normalizePath(pathSegments) || 'Resumo';
    
        function normalizePath(path: string[]): string {
            const cleanedPath = path.filter(segment => segment !== 'dashboard');
    
            const teamIndex = cleanedPath.findIndex(segment => segment.includes('[nameTeam]'));
            if (teamIndex !== -1) {
                cleanedPath[teamIndex] = `${nameTeam ? nameTeam : "Visualizar"}`;
            }
    
            return cleanedPath.map((segment) => {
                return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
            }).join(' - ');

        }
    };

    return (
        <header className={styles.headerDashboard}>
            <div className={styles.contentUser}>
                <span>{nameUser}</span>
                <img src={imageUser} alt="" />
            </div>
            <nav>
                <div className={styles.back}>
                    <button 
                        className={styles.arrowBack} 
                        title="Voltar" 
                        onClick={handleBack}
                    >
                        <img src="/icons/arrow.svg" alt="<---" />
                    </button>
                    <span>Painel - {getDynamicPath()}</span>
                </div>
                {
                    warning?.display ? (
                        <div className={styles.warningContent}>
                            <span>{warning.message}</span>
                        </div>
                    ): ""
                }
            </nav>
        </header>
    );
}
