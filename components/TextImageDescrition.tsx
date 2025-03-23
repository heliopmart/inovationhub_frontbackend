import React from "react";
import style from "@/styles/components/TextImageDescrition.module.scss"

interface Size{
    width?: string;
    height?: string;
}

export function TextImageDescrition({image, size, direction, form, children}:{image: string|undefined, size?: Size, direction:'right'|'left', form?: "start"|"center"|"stretch", children: React.ReactNode}) {
    return (
        <div className={`${style.content} ${direction === 'right' ? style.contentRight : style.contentLeft}`} style={{alignItems: form}}>
            <div className={style.image} style={{width: size?.width, height: size?.height}}>
                <img src={image} alt="" />
            </div>
            <div className={style.content_chil}>
                {children}
            </div>
        </div>
    )
}

export function TextTwoImageDescrition({image_1, image_2, size, direction, children}:{image_1: string, image_2: string, size?: Size, direction:'right'|'left', children: React.ReactNode}) {
    return (
        <div className={`${style.contentTwoImages} ${direction === 'right' ? style.contentRight : style.contentLeft}`}>
            <div className={style.contenImages}>
                <div className={style.image} style={{width: size?.width, height: size?.height}}>
                    <img src={image_1} alt="" />
                </div>
                <div className={style.image} style={{width: size?.width, height: size?.height}}>
                    <img src={image_2} alt="" />
                </div>
            </div>
            <div className={style.content_chil}>
                {children}
            </div>
        </div>
    )
}