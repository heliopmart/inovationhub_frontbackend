import Link from 'next/link'
import style from "@/styles/components/Docs.module.scss"
import {download_file} from "@/services/function.download.file"


interface InterfaceDocs{
    title: string,
    files: {
        name: string,
        link: string
    }[]
}

export function Docs({docs}: { docs: InterfaceDocs[] }) {
    return (
        <section className={style.docs}>
            {
                docs?.map((data, index) => (
                    <div className={style.containerDoc}>
                        <h6 className={style.title}>{data.title}</h6>
                        <div className={style.contentFile}>
                            {
                                data?.files?.map((file, indexFile) => (
                                    <span onClick={(e) => download_file('doc', file.link)} key={`file-${index}-${index}-${data.title}`}> {file.name} </span>
                                ))
                            }
                        </div>
                    </div>
                ))
            }
        </section>
    )
}