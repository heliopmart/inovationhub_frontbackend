"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import style from '@/styles/components/Kpis.module.scss'
import { useEffect, useState } from "react";

type TypedataSeries = {
    name: string,
    values: number[],
    color: string
}

interface InterfaceKpis{
    month: string[],
    title: string,
    dataSeries: TypedataSeries[]
}

export function KpisComponent({month, dataSeries, title}: InterfaceKpis){
    const [dataState, setDataState] = useState<any[]>([])
    const [dataSeriesState, setDataSeriesState] = useState<TypedataSeries[]>([])

    useEffect(() => {
        const data = month.map((mes, index) => {
            let entry: any = { name: mes };
            dataSeries.forEach(serie => {
              entry[serie.name] = serie.values[index];
            });
            return entry;
        });

        setDataState(data)
        setDataSeriesState(dataSeries)
    },[month, dataSeries])

    return (
        <div className={style.contentKpiGraph}>
            <span className={style.title}>{title}</span>
            <div className={style.contentGraph}>
            <ResponsiveContainer width="100%" height={"100%"}>
                <LineChart data={dataState}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <Tooltip />
                    {dataSeriesState.map((serie, index) => (
                    <Line key={index} type="monotone" dataKey={serie.name} stroke={serie.color} strokeWidth={2} />
                    ))}
                </LineChart>
                </ResponsiveContainer>
            </div>
            <div className={style.contentSubtext} data-text="Legenda">
                {
                    dataSeriesState?.map((key, index) => (
                        <div className={style.tag} key={`${index}_${key.name}`}> <div style={{backgroundColor: key.color}}/> <span>{key.name}</span> </div>
                    ))
                }
            </div>
        </div>
    )
}