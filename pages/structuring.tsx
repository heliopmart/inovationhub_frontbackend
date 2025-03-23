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

import {getAllResources, getInvestorInvestments, getInvestorTransfer, getResourceExpenses, getAllBids} from "@/services/function.structuring"
import {GetResourceReturn, GetInvestmentsReturn, GetTransfersReturn, GetExpensesReturn, GetBidsReturn} from "@/types/interfacesSql"

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

export default function aboutUs({ messages }: { messages: any }) {
    const [txtFooter, setTxtFooter] = useState({});
    const [txtNav, setTxtNav] = useState({});
    const { locale } = useRouter();

    const [resources, setResources] = useState<GetResourceReturn>()
    const [investment, setInvestment] = useState<GetInvestmentsReturn>()
    const [transfers, setTransfers] = useState<GetTransfersReturn>()
    const [expenses, setExpenses] = useState<GetExpensesReturn>()
    const [bids, setBids] = useState<GetBidsReturn>()
    
    useEffect(() => {
        async function loadMessages() {
            const translationsFooter = await getTranslations("footer", locale || "pt");
            const translationsNav = await getTranslations("navbar", locale || "pt");
            setTxtFooter(translationsFooter);
            setTxtNav(translationsNav)
        }
        loadMessages();
    }, [locale]);

    useEffect(() => {
        async function get (){
            const resResource = await getAllResources()
            const resInvestments = await getInvestorInvestments()
            const resTransfer = await getInvestorTransfer()
            const resExpenses = await getResourceExpenses()
            const resBids = await getAllBids()
            if(resResource.st)
                setResources(resResource)

            if(resInvestments.st)
                setInvestment(resInvestments)

            if(resTransfer.st)
                setTransfers(resTransfer)

            if(resExpenses.st)
                setExpenses(resExpenses)
            
            if(resBids.st)
                setBids(resBids)

            console.log(resExpenses)
        }
        get()
    },[])

    return (
        <>
            <Navbar messages={txtNav} page="structuring" key={"structuring-Nav"}/>
            <HeaderMinify title={messages.titleHeader}  background={"linear-gradient(78deg, #fff 46%, #FFD6BB 100%);"}  key={"structurings_Headers"}/>
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
                    <DynamicTable noText={true} title="" p="" columnDefs={resources?.table} rowData={resources?.value ? resources?.value : []} key={"resources_table"}/>
                </div>
            </section>
            <hr />
            <main className={styles.sectionModuleTables} id="financial">
                <h2 className={styles.title}>{messages.financialTitleSection}</h2>
                <DynamicTable title={messages.financial.title_1} p={messages.financial.p_1} columnDefs={investment?.table} rowData={investment?.value ? investment.value : []} key={"finance_table"}/>
                <hr />
                <DynamicTable title={messages.financial.title_2} p={messages.financial.p_2} columnDefs={transfers?.table} rowData={transfers?.value ? transfers.value : []} key={"Transfers_table"}/>
                <hr />
                <DynamicTable title={messages.financial.title_3} p={messages.financial.p_3} columnDefs={expenses?.table} rowData={expenses?.value ? expenses.value : []} key={"Allocation_table"}/>
                 <hr />
                <DynamicTable title={messages.financial.title_4} p={messages.financial.p_4} columnDefs={bids?.table} rowData={bids?.value ? bids.value : []} key={"Bids_table"}/>
            </main>
            <section className={styles.docsSection} id="docs">
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
