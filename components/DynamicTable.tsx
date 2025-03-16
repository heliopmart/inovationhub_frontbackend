'use client'
import style from "@/styles/components/DynamicTable.module.scss"
import { AllCommunityModule, ModuleRegistry, ColDef } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react';
ModuleRegistry.registerModules([AllCommunityModule]);
import {
    themeAlpine, // Escolha um tema base
    colorSchemeDark, // Se quiser um esquema de cores específico
    iconSetMaterial, // Se quiser personalizar os ícones
} from "ag-grid-community";
  
// Aplicando o tema fixo
const theme = themeAlpine.withPart(colorSchemeDark).withPart(iconSetMaterial);

interface InterfaceDynamicTable{
    columnDefs: ColDef[],
    rowData: any[],
    title: string,
    p: string,
    noText?: boolean
}

export function DynamicTable({columnDefs, rowData, title, p, noText}:InterfaceDynamicTable){
    return (
        <section className={style.sectionTable}>
            {noText?"":(
                <>
                    <h2 dangerouslySetInnerHTML={{__html: title}}/>
                    <p dangerouslySetInnerHTML={{__html: p}}/>
                </>
            )}
            <div className={style.contentTable}>
                <div className="ag-theme-alpine" 
                    style={{width: "100%", fontSize: "14px", borderRadius: "10px" }}>
                    <AgGridReact 
                        theme={theme} // Aplica o tema fixo escolhido
                        rowData={rowData} 
                        columnDefs={columnDefs} 
                        pagination={true} 
                        paginationPageSize={100} // Quantidade de linhas por página
                        animateRows={true} // Animação ao carregar
                        rowSelection="single" // Permite selecionar uma linha
                        domLayout="autoHeight" // Ajuste automático da altura
                        suppressHorizontalScroll={false} // Remove scrollbar horizontal se não necessário
                        defaultColDef={{ resizable: true, filter: true, sortable: true, flex: 1 }} // Torna as colunas ajustáveis
                    />
                </div>
            </div>
        </section>
    )
}