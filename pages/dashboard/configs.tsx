import { GetStaticProps } from "next";
import Link from "next/link";
import { getTranslations } from "@/lib/getTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import withAuth from '@/hoc/withAuth';
import {authUser} from "@/types/interfaceClass"

import {NavDashBoard} from "@/components/NavDashBoard"
import {HeaderDashBoard} from "@/components/HeaderDashBoard"

import {DefaultInput, SelectInput} from "@/components/Input"

import styles from '@/styles/pages/dashboard_config.module.scss' 

import {getUserInformations, updateUserInformations} from "@/services/function.dashboard.config"
import {UserForConfigProps} from "@/types/interfaceDashboardSql"


function DashBoardConfig({ messages, authUser}: { messages: any, authUser: authUser}){
    const [user, setUser] = useState<UserForConfigProps>();
    const [image, setImage] = useState<string>("");
    const [imageFile, setImageFile] = useState<any>();

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
          setImageFile(file);
          setImage(URL.createObjectURL(file));
        }
    }

    const changeInformation = (key:string, value:string) => {
        if(key === "linkedin" || key === "instagram"){
            const socialMedia = (user?.user.socialMedia || []).map((item) => {
                if(item.type === key){
                    return {
                        ...item,
                        link: value
                    }
                }
                return item;
            })
            setUser((prevUser) => {
                if (prevUser) {
                    return { 
                        ...prevUser, 
                        user: { 
                            ...prevUser.user, 
                            socialMedia: socialMedia as { link: string; type: string; }[]
                        } 
                    };
                }
                return prevUser;
            });
        }

        setUser((prevUser) => {
            if (prevUser) {
                return { 
                    ...prevUser, 
                    user: { 
                        ...prevUser.user, 
                        [key]: value 
                    } 
                };
            }
            return prevUser;
        });

    }

    async function saveInformations() {
        if (!user) return;
    
        const userId = user.user.id;
        const data = {
            id: userId,
            name: user.user.name,
            tell: user.user.tell,
            color: user.user.color,
            socialMedia: user.user.socialMedia
        };
        const responseStatus = await updateUserInformations(data, imageFile ? imageFile : undefined);   
        if(responseStatus){
            alert("Atualizado!")
        }
    }

    function disableAccount(){

    }

    useEffect(() => {
        async function get(){
            const requestUser = await getUserInformations(authUser.user.id);
            if(!requestUser.st)
                return 

            setImage(requestUser.value?.user.image || "");
            setUser(requestUser.value ?? undefined);
        }
        get()
    },[])

    return (
        <section className={styles.section}>
            <div className={styles.menuContent}>
                <NavDashBoard links={messages.links.links}/>
            </div>
            <div className={styles.paintContent}>
                <HeaderDashBoard nameTeam={""} imageUser={authUser.user.image} nameUser={authUser.user.name} key={"header-dashboard-config"} />
                <div className={styles.container}>
                    <section className={styles.sectionContent}>
                        <span className={styles.TitleSection}>Minhas Informações</span>
                        
                        <div className={styles.containerImageUser}>
                            <label htmlFor="image_select">
                                <img src={`${image}`} alt="" />
                                <button type="button" title="Change Image">Alterar Imagem</button>
                                <input id="image_select" accept="image/*" type="file" onChange={handleImageChange}/>
                            </label>
                        </div>  

                        <form className={styles.contentInputs}>
                            <DefaultInput minLength={10} placeholder="Nome Completo"  text="Nome Completo" returnValue={(e) => {changeInformation('name', e)}} type="text" value={user?.user.name || ""} key={"key-config-name"}/>
                            <DefaultInput minLength={10} placeholder="E-mail"  text="E-mail" returnValue={(e) => {}} type="email" value={user?.email || ""} key={"key-config-email"}/>
                            <DefaultInput minLength={10} placeholder="Telefone"  text="Telefone: " returnValue={(e) => {changeInformation('tell', e)}} type="tell" value={user?.user.tell || ""} key={"key-config-tell"}/>
                            <DefaultInput minLength={10} placeholder="Curso"  text="Curso: " returnValue={(e) => {}} type="text" value={user?.user.graduations[0] || ""} key={"key-config-course"}/>
                            <DefaultInput minLength={10} placeholder="Semestre: "  text="Semestre: " returnValue={(e) => {}} type="text" value={""} key={"key-config-semester"}/>
                            <DefaultInput minLength={10} placeholder="Alterar minha cor"  text="Alterar minha cor" returnValue={(e) => {changeInformation('color', e)}} type="color" value={user?.user.color || ""} key={"key-config-color"}/>
                            <DefaultInput minLength={10} placeholder="Instagram Link"  text="Instagram Link: " returnValue={(e) => {changeInformation('instagram', e)}} type="text" value={user?.user?.socialMedia[0].link || ""} key={"key-config-instagram"}/>
                            <DefaultInput minLength={10} placeholder="LinkedIn Link"  text="LinkedIn Link: " returnValue={(e) => {changeInformation('linkedin', e)}} type="text" value={user?.user?.socialMedia[1].link || ""} key={"key-config-linkedin"}/>
                            
                            <Link href={``} className={styles.textLinkDocs}><span> Políticas de uso de dados e privacidade </span></Link>
                            <Link href={``} className={styles.textLinkDocs}><span> Adequação a Lei lgpd </span></Link>

                            <button className={styles.buttonForm} title="Send" type="button" onClick={(e) => {saveInformations()}}>Enviar</button>
                        </form>

                        <button className={styles.DisableAccount} onClick={() => {}}>Desativar minha conta</button>
                    </section>
                </div>
            </div>
        </section>
    )
}


export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const messages = {
        links: await getTranslations("NavDashBoard", locale || "pt")
    };

    return {
        props: {messages},
        revalidate: 60,
    };
};

export default withAuth(DashBoardConfig);