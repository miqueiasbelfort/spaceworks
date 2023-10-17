import { useContext } from "react";
import {AuthContext} from '../../context/AuthContext';

function ItemList({type, title, name, email, department, role, order, date, editShowModal, clickToPage, handleDeleteUser}) {

    const {user} = useContext(AuthContext);

    const stringLength = (txt) => {
        if(txt.length <= 100){
            return txt;
        }
        return txt.slice(0, 100) + '...';
    }

  return (
    <li className="w-full p-3 flex items-center flex-col text-center lg:flex-row lg:text-start justify-between border border-slate-600 rounded shadow">
        <div className="flex items-center gap-7 flex-col lg:flex-row">
            <div>
                {type == "user" ? <i className="bi bi-person-circle text-xl"></i> : <i className="bi bi-person-raised-hand text-xl"></i>}
            </div>
            <div className="cursor-pointer transition-all hover:underline" onClick={clickToPage}>
                <h3 className="font-bold">{stringLength(type != 'user' ? title : name)} 
                    {(type == "chamado" && order == 'Alto') && <span className="text-red-600 font-bold"><i className="bi bi-caret-right-fill"></i> Alto - Urgente</span>}
                    {(type == "chamado" && order == 'Media') && <span className="text-yellow-600 font-bold"><i className="bi bi-caret-right-fill"></i> Médio - Tem Urgência</span>}
                    {(type == "chamado" && order == 'Baixa') && <span className="text-slate-500 font-bold"><i className="bi bi-caret-right-fill"></i> Baixo - Sem Urgência</span>}
                </h3>
                {type == 'user' && <span>Cargo: {role}</span>}
                <div>
                    <span className="text-red-600 font-bold">{type != 'user' ? name : "Email: " + email}</span>
                    {type != 'user' && (
                        <>
                            <span> - </span>
                            <span className="text-red-600">{date}</span>
                        </>
                    )}
                    <span> - </span>
                    <span className="text-red-600">Setor: {department}</span>
                </div>
            </div>
        </div>
        {type == 'user' && user?.role === "Desenvolvedor" && (
            <div className="flex items-center gap-6">
                <button onClick={editShowModal} className="text-yellow-600 underline font-bold hover:text-yellow-800">Editar <i className="bi bi-pencil"></i></button>
                <button onClick={handleDeleteUser} className="text-red-600 underline font-bold hover:text-red-800">Excluir <i className="bi bi-trash"></i></button>
            </div>
        )}
    </li>
  )
}

export default ItemList;