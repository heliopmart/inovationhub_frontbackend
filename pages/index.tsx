import { GetStaticProps } from "next";
import { getTranslations } from "@/lib/getTranslations";
import "@/styles/pages/index.module.scss"

export default function Index({ messages }: { messages: any }) {
  return (
    <div>
      <h1>{messages.title}</h1>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = await getTranslations("index", locale || "pt");

  return {
    props: { messages },
  };
};
