import React from "react";
import style from "@/styles/components/TextImageDescrition.module.scss"

interface Size{
    width?: string;
    height?: string;
}

export function TextImageDescrition({image, size, direction, children}:{image: string, size?: Size, direction:'right'|'left', children: React.ReactNode}) {
    return (
        <div className={`${style.content} ${direction === 'right' ? style.contentRight : style.contentLeft}`}>
            <div className={style.image} style={{width: size?.width, height: size?.height}}>
                <img src={image} alt="" />
            </div>
            <div className={style.content_chil}>
                {children}
            </div>
        </div>
    )
}