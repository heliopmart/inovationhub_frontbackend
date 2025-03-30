import style from "@/styles/components/PartnersContact.module.scss"
import {DefaultInput} from "@/components/Input"

interface PartnersContact{
    NameEnterprise: (e:string) => void
    EconomicEnterprise: (e:string) => void
    RoleEnterprise: (e:string) => void
    UserEnterprise: (e:string) => void
    EmailEnterprise: (e:string) => void
    ButtonSend: () => void
    isSend: boolean
    name: string,
    economic: string,
    role: string,
    user: string,
    email: string,
    message: {
        title: string,
        subTitle: string,
        p: string,
        buttonText: string,
        input: string[]
    }
}

export function PartnersContact({ButtonSend, EconomicEnterprise,EmailEnterprise,RoleEnterprise,UserEnterprise,NameEnterprise,economic,email,message,name,role,user, isSend}:PartnersContact){
    return (
        <section className={style.partnersSection}>
            <h2 className={style.title}>{message.title}</h2>
            <span className={style.subTittle}>{message.subTitle}</span>
            {!isSend ? (
                <div className={style.contentInputs}>
                    <DefaultInput text={message.input[0]} minLength={5} placeholder={message.input[0]} returnValue={(r) => NameEnterprise(r)} type="text" value={name} key={"interpriseName"}/>
                    <DefaultInput text={message.input[1]} minLength={5} placeholder={message.input[1]} returnValue={(r) => EconomicEnterprise(r)} type="text" value={economic} key={"interpriseEconomic"}/>
                    <DefaultInput text={message.input[2]} minLength={5} placeholder={message.input[2]} returnValue={(r) => UserEnterprise(r)} type="text" value={user} key={"interpriseUser"}/>
                    <DefaultInput text={message.input[3]} minLength={5} placeholder={message.input[3]} returnValue={(r) => RoleEnterprise(r)} type="text" value={role} key={"interpriseRole"}/>
                    <DefaultInput text={message.input[4]} minLength={5} placeholder={message.input[4]} returnValue={(r) => EmailEnterprise(r)} type="text" value={email} key={"interpriseEmail"}/>
                    <p>{message.p}</p>
                    <button className={style.button} onClick={() => ButtonSend()} title={"Send"}>{message.buttonText}</button>
                </div>
            ):(
                <div className={style.sendContent}>
                    <p>
                        <b> Obrigado por seu interesse em se tornar parceiro do Hub de Inovações UFGD! </b> Em breve, entraremos em contato para alinhar ideias e <u> construir um futuro inovador juntos.</u>
                    </p>
                </div>
            )}
            
        </section>
    )
}