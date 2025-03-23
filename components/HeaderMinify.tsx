
import styles from '@/styles/components/HeaderMinify.module.scss'
export function HeaderMinify({title, background, style}: {title: string, background: string, style?: object}) {
    return (
        <header className={styles.header} style={{background: `${background}`}}>
            <h1 className={styles.title} style={style} dangerouslySetInnerHTML={{__html: title}}/>
        </header>
    )
}