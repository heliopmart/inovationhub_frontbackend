import style from "@/styles/components/InputFilter.module.scss";

interface InputFilterProps {
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value: string;
    options: string[];
}

export function InputFilter({ placeholder, onChange, value, options }: InputFilterProps) {
    return (
        <div className={style.inputFilter}>
            <select title="Filter for" onChange={onChange} value={value ? value : "none"}>
                <option value="none" disabled>{placeholder}</option>
                {options.map((option, index) => (
                    <option key={option} value={index}>
                        {option}
                    </option>   
                ))}
            </select>
        </div>
    )
}