import { useEffect, useState } from "react";

function Form({actionToClose, fields = [], title, btn1, btn2, onForm}) {

    const [isDisable, setIsDisable] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        onForm();
    };

    useEffect(() => {
        const checkFields = () => {
            for(let i = 0; i < fields.length; i++){
                if(fields[i].value !== ''){
                    setIsDisable(true);
                } else {
                    setIsDisable(false);
                }
            }
        }
        checkFields();
    }, [fields])

  return (
    <div className={`w-full h-full dark:text-white flex items-center justify-center bg-slate-950/50`}>
        <form onSubmit={onSubmit} className="p-5 bg-white dark:bg-slate-950 w-full lg:max-w-lg flex flex-col gap-4 shadow dark:shadow-gray-600 ">
            <h2 className="text-lg font-semibold">{title}</h2>
            {fields.map((field) => {
                if(!field.isSelect && !field.isMultiline){
                    return (
                        <div className="flex flex-col" key={field.id}>
                            <label htmlFor={field.label}>{field.label}</label>
                            <input value={field.value} onChange={e => field.setValue(e.target.value)} id={field.label} className="p-3 w-full outline-none rounded mt-2 border text-black" type={field.type} placeholder={field.placeholder}/>
                        </div>
                    )
                } else if(field.isSelect){
                    return (
                        <div className="flex flex-col" key={field.id}>
                            <label htmlFor={field.label}>{field.label}</label>
                            <select id={field.label} className="p-3 w-full outline-none rounded mt-2 border text-black" value={field.value} onChange={e => field.setValue(e.target.value)}>
                                <option defaultChecked value="">{field.placeholder}</option>
                                {field.options?.map((item, i) => (
                                    <option key={i} value={!field?.values ? item : field.values[i]}>{item}</option>
                                ))}
                            </select>
                        </div>
                    )
                } else {
                    return (
                        <div className="flex flex-col" key={field.id}>
                            <label htmlFor={field.label}>{field.label}</label>
                            <textarea value={field.value} onChange={e => field.setValue(e.target.value)} id={field.label} className="h-24 p-3 w-full outline-none rounded mt-2 border text-black resize-none" placeholder={field.placeholder}></textarea>
                        </div>
                    )
                }
            })}    
            <div className="flex items-center justify-between flex-col lg:flex-row gap-3">
                <button disabled={!isDisable} type="submit" className="bg-green-600 w-full disabled:bg-green-500/50 text-white p-4 rounded font-bold transition-all hover:bg-green-900">{btn1} <i className="bi bi-caret-up-fill"></i></button>
                <button onClick={actionToClose} type="reset" className="bg-red-600 w-full text-white p-4 rounded font-bold transition-all hover:bg-red-900">{btn2}</button>
            </div>
        </form>
    </div>
  )
}

export default Form;