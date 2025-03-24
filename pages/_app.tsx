"use client";
import "@/styles/globals.scss";
import Head from 'next/head';
import { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Hub de inovações | UFGD - Criando um futuro Inovador</title>
        <meta name="description" content="Um Hub recheado de projetos inovadores criados por universitários e professores da UFGD." />
        <meta name="keywords" content="inovação, startups, tecnologia, colaboração, projeto de extensão, universitários, universidade federal da grande dourados, UFGD, Brasil, Mato Grosso do Sul, MS, inovação" />
        <meta name="author" content="Hélio Martins" />
        <meta property="og:title" content="Hub de inovações - Plataforma de Inovação" />
        <meta property="og:description" content="Conectando startups e projetos inovadores." />
        <meta property="og:url" content="https://hubdeinovacoesUFGD.com" />
        <meta property="og:site_name" content="Hub de inovações | UFGD" />
        <meta property="og:image" content="https://hubdeinovacoesUFGD.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hub de inovações | UFGD - Criando um futuro Inovador" />
        <meta name="twitter:description" content="Um Hub recheado de projetos inovadores criados por universitários e professores da UFGD." />
        <meta name="twitter:image" content="https://hubdeinovacoesUFGD.com/og-image.jpg" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
