'use client'
import { GetStaticProps } from "next";
import Link from 'next/link'
import {ColDef } from 'ag-grid-community'; 
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/getTranslations";

import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';
import {HeaderMinify} from "@/components/HeaderMinify";
import {TextImageDescrition} from "@/components/TextImageDescrition";
import {DynamicTable} from "@/components/DynamicTable"
import {Docs} from '@/components/Docs'

import styles from "@/styles/pages/structuring.module.scss"

interface InterfaceProjects{
    titleProject: string,
    p: string,
    color: string,
    image: string,
    direction?: "left" | 'right' 
}
interface InterfaceDocs{
    title: string,
    files: {
        name: string,
        link: string
    }[]
}

const docsData: InterfaceDocs[] = [
    {
        title: "Balanço financeiro 2025/1",
        files: [
            {
                name: "Balanço financeiro fechado total 2025/1 - Hub de inovações UFGD",
                link: ""
            }
        ]
    },
    {
        title: "Balanço financeiro 2025/2",
        files: [
            {
                name: "Balanço financeiro fechado total 2025/2 - Hub de inovações UFGD",
                link: ""
            },
            {
                name: "Aquisições e repasses fechado 2025/2 - Hub de inovações UFGD",
                link: ""
            },
            {
                name: "Alocação para equipes fechado 2025/2 - hub de inovações UFGD",
                link: ""
            },
            {
                name: "Orçamento aprovado para 2026/1 - hub de inovações UFGD",
                link: ""
            }
        ]
    }
]


const calcularTempoUso = (dataCompra:string) => {
    const dataCompraDate = new Date(dataCompra);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dataCompraDate.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return `${diffYears} anos e ${diffMonths} meses`;
};

const columnDefs: ColDef[]  = [
    { field: "recurso", headerName: "Recurso", sortable: true, filter: true },
    { field: "valor", headerName: "Valor (R$)", sortable: true, filter: "agNumberColumnFilter", valueFormatter: (params) => `R$ ${params.value.toLocaleString("pt-BR")}` },
    { field: "data_compra", headerName: "Data de Compra", sortable: true, filter: true },
    { field: "tempo_uso", headerName: "Tempo de Uso", sortable: true, filter: true, cellRenderer: (params:string) => calcularTempoUso(params)},
    { field: "status", headerName: "Status", sortable: true, filter: true, cellRenderer: (params:string) => params === "Usado" ? "✅" : "⚪" },
    { field: "alocacao", headerName: "Alocação", sortable: true, filter: true },
    { field: "atencao", headerName: "Atenção", sortable: true, filter: true, cellRenderer: (params:string) => {
        if (params === "Precisa de manutenção") return "⚠️";
        if (params === "Precisa de insumos") return "🛒";
        return "✅";
        }},
    { field: "fornecedor", headerName: "Fornecedor", sortable: true, filter: true },
    { field: "numero_serie", headerName: "Número de Série", sortable: true, filter: true },
    { field: "ultima_manutencao", headerName: "Última Manutenção", sortable: true, filter: true },
    { field: "proxima_manutencao", headerName: "Próxima Manutenção", sortable: true, filter: true },
    { field: "responsavel", headerName: "Responsável", sortable: true, filter: true },
];

const rowData = [
{
    recurso: "Impressora 3D",
    valor: 15000,
    data_compra: "2022-06-10",
    tempo_uso: "2 anos e 3 meses", // Calculado automaticamente
    status: "Usado",
    alocacao: "Núcleo de Engenharia",
    atencao: "Precisa de insumos",
    fornecedor: "TechSupply",
    numero_serie: "123456789",
    ultima_manutencao: "2023-12-15",
    proxima_manutencao: "2024-06-15",
    responsavel: "João Silva",
},
{
    recurso: "Fresadora CNC",
    valor: 45000,
    data_compra: "2021-03-22",
    tempo_uso: "3 anos e 6 meses",
    status: "Não Usado",
    alocacao: "Equipe de Prototipagem",
    atencao: "Funcionando",
    fornecedor: "Máquinas XYZ",
    numero_serie: "987654321",
    ultima_manutencao: "2023-11-10",
    proxima_manutencao: "2024-05-10",
    responsavel: "Maria Oliveira",
}
];


export default function aboutUs({ messages }: { messages: any }) {
    const [txtFooter, setTxtFooter] = useState({});
    const [txtNav, setTxtNav] = useState({});
    const { locale } = useRouter();
    
    useEffect(() => {
    async function loadMessages() {
        const translationsFooter = await getTranslations("footer", locale || "pt");
        const translationsNav = await getTranslations("navbar", locale || "pt");
        setTxtFooter(translationsFooter);
        setTxtNav(translationsNav)
    }
    loadMessages();
    }, [locale]);
    return (
        <>
            <Navbar messages={txtNav} page="structuring" key={"structuring-Nav"}/>
            <HeaderMinify title={messages.titleHeader}  background={"linear-gradient(78deg, #fff 46%, #FFD6BB 100%);"}  key={"structuring-Header"}/>
            <section className={styles.sectionPHeader}>
                <p dangerouslySetInnerHTML={{__html: messages.pHeader}}/>
            </section>
            <section className={styles.diagramSection} id="modelandoperation">
                <h3 className={styles.titleSection} dangerouslySetInnerHTML={{__html: messages.titleDiagramSection}}/>
                <div className={styles.contentImage}>
                    <img src="/assets/fluxograma_hierarquico.png" alt="Fluxograma hierarquico hub de inovações ufgd" />
                </div>
                <h3 className={styles.titleSection} dangerouslySetInnerHTML={{__html: messages.titleInfrastructureSection}}/>
                <p  dangerouslySetInnerHTML={{__html: messages.pInfrastructureSection}}/>
            </section>
            <section className={styles.infrastructureSection} id="infrastructure">
                {
                    messages.infrastructure?.map((data:InterfaceProjects, index:number) => (
                        <TextImageDescrition key={`${index}-infrastructure`} image={data.image} direction={data.direction as 'left' | 'right'} form={"stretch"}>
                            <div className={`${styles.contentDescription}`}>
                                <div className={styles.contentTitleDescription}>
                                    <h6 className={styles.titleContent} style={{color: data.color}} dangerouslySetInnerHTML={{__html: data.titleProject}}/>
                                </div>
                                <p className={styles.pContent} dangerouslySetInnerHTML={{__html: data.p}}/>
                            </div>
                        </TextImageDescrition>
                    ))
                }
            </section>
            <hr />
            <section className={styles.resourcesSection} id="resources">
                <h3 className={styles.titleSection} dangerouslySetInnerHTML={{__html: messages.titleResourcesSection}}/>
                <p dangerouslySetInnerHTML={{__html: messages.pResourcesSection}}/>
                <div className={styles.contentTable}>
                    <DynamicTable noText={true} title="" p="" columnDefs={columnDefs} rowData={rowData} key={"resources_table"}/>
                </div>
            </section>
            <hr />
            <main className={styles.sectionModuleTables} id="financial">
                <h2 className={styles.title}>{messages.financialTitleSection}</h2>
                <DynamicTable title={messages.financial.title_1} p={messages.financial.p_1} columnDefs={columnDefs} rowData={rowData} key={"finance_table"}/>
                <hr />
                <DynamicTable title={messages.financial.title_2} p={messages.financial.p_2} columnDefs={columnDefs} rowData={rowData} key={"Transfers_table"}/>
                <hr />
                <DynamicTable title={messages.financial.title_3} p={messages.financial.p_3} columnDefs={columnDefs} rowData={rowData} key={"Allocation_table"}/>
                 <hr />
                <DynamicTable title={messages.financial.title_4} p={messages.financial.p_4} columnDefs={columnDefs} rowData={rowData} key={"Bids_table"}/>
            </main>
            <section className={styles.docsSection}>
                <h3 className={styles.title} dangerouslySetInnerHTML={{__html: messages.ClosedFinancialStatementTittle}}/>
                <Docs docs={docsData} />
            </section>  

            {txtFooter?(<Footer messages={txtFooter}/> ):""}
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = await getTranslations("structuring", locale || "pt");

    return {
        props: { messages },
    };
};
