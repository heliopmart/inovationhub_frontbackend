import { GetStaticProps } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DashboardResume({messages}: { messages: any }){
    const { locale } = useRouter();

    return (
        <>
            
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = await getTranslations("resume", locale || "pt");

    return {
        props: { messages },
    };
};
