import style from '@/styles/components/Input.module.scss'
import Link from 'next/link'

interface InterfaceDefaultInput{
    type: string,
    placeholder: string,
    text: string,
    value: string,
    minLength: number,
    returnValue: (r:string) => void
    isPassword?: boolean
}

interface InterfaceSelectCoursesInput{
    text: string,
    courses: Array<Array<string>>
    value: string
    returnValue: (r:string) => void
}

interface InterfaceSelectInput{
    text: string,
    courses: Array<string>
    value: string
    returnValue: (r:string) => void
}

export function DefaultInput({type,isPassword,placeholder,text,value, minLength, returnValue}:InterfaceDefaultInput) {
    return (
        <div className={style.inputContent}>
            <span>{text}</span>
            <input type={type} placeholder={placeholder} minLength={minLength} value={value} onChange={(e) => returnValue(e.target.value)} />
            {
                isPassword?(
                    <Link href={"/password"} className={style.password}> <span>Esqueci a senha</span> </Link>
                ):""
            }
        </div>
    );
}

export function SelectCoursesInput({text, value, returnValue, courses}:InterfaceSelectCoursesInput) {
    return (
        <div className={`${style.inputContent} ${style.selectInput}`}>
            <span>{text}</span>
            <select title={text} name='courses' onChange={(e) => returnValue(e.target.value)} value={value}>
                <option value={0} selected={true} disabled={true}>Selecionar</option>
                <option disabled={true}>FACE</option>
                {courses[0].map((curse:string) => (
                    <option value={curse}>{curse}</option>
                ))}
                <option disabled={true}>FCA</option>
                {courses[1].map((curse:string) => (
                    <option value={curse}>{curse}</option>
                ))}
                <option disabled={true}>FCBA</option>
                {courses[2].map((curse:string) => (
                    <option value={curse}>{curse}</option>
                ))}
                <option disabled={true}>FACET</option>
                {courses[3].map((curse:string) => (
                    <option value={curse}>{curse}</option>
                ))}
                <option disabled={true}>FCH</option>
                {courses[4].map((curse:string) => (
                    <option value={curse}>{curse}</option>
                ))}
                <option disabled={true}>FCS</option>
                {courses[5].map((curse:string) => (
                    <option value={curse}>{curse}</option>
                ))}
                <option disabled={true}>FALE</option>
                {courses[6].map((curse:string) => (
                    <option value={curse}>{curse}</option>
                ))}
                <option disabled={true}>FADIR</option>
                {courses[7].map((curse:string) => (
                    <option value={curse}>{curse}</option>
                ))}
                <option disabled={true}>FAED</option>
                {courses[8].map((curse:string) => (
                    <option value={curse}>{curse}</option>
                ))}
                <option disabled={true}>FAEN</option>
                {courses[9].map((curse:string) => (
                    <option value={curse}>{curse}</option>
                ))}
            </select>
        </div>
    );
}

export function SelectInput({text, value, returnValue, courses}:InterfaceSelectInput) {
    return (
        <div className={`${style.inputContent} ${style.selectInput}`}>
            <span>{text}</span>
            <select title={text} name='courses' onChange={(e) => returnValue(e.target.value)} value={value}>
                <option value={0} selected={true} disabled={true}>Selecionar</option>
                {courses.map((curse: string) => (
                    <option value={curse}>{curse}</option>
                ))}
            </select>
        </div>
    );
}