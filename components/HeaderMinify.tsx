
import styles from '@/styles/components/HeaderMinify.module.scss'
import { useEffect } from 'react'
export function HeaderMinify({title, background}: {title: string, background: string}) {
    return (
        <header className={styles.header} style={{background: `${background}`}}>
            <h1 className={styles.title}>{title}</h1>
        </header>
    )
}