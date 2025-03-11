"use client";
import "@/styles/globals.scss";
import { Metadata } from "next";
import { AppProps } from "next/app";

export const metadata: Metadata = {
  title: "Hub de inovações | UFGD - Criando um futuro Inovador",
  description: "Um Hub recheado de projetos inovadores criados por universitários e professores da UFGD.",
  keywords: "inovação, startups, tecnologia, colaboração, projeto de extensão, universitários, universidade federal da grande dourados, UFGD, Brasil, Mato Grosso do Sul, MS, inovação",
  authors: [{ name: "Hélio Martins" }],
  openGraph: {
    title: "InvasionHub - Plataforma de Inovação",
    description: "Conectando startups e projetos inovadores.",
    url: "https://hubdeinovacoesUFGD.com",
    siteName: "Hub de inovações | UFGD",
    images: [
      {
        url: "https://hubdeinovacoesUFGD.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Imagem do InvasionHub",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@hubdeinovacoesufgd",
    title: "Hub de inovações | UFGD - Criando um futuro Inovador",
    description: "Um Hub recheado de projetos inovadores criados por universitários e professores da UFGD.",
    images: ["https://hubdeinovacoesUFGD.com/og-image.jpg"],
  },
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
