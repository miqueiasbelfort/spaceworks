import { useState } from "react";
import {servicesChamados} from '../../services/api';
import { notification } from "../../utils/notifications";

function Chamar() {

  const [title, setTitle] = useState('');
  const [to, setTo] = useState('');
  const [order, setOrder] = useState(0);
  const [department, setDepartment] = useState('Suporte');
  const [desc, setDesc] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    try {

      const token = localStorage.getItem('token');
      await servicesChamados.createChamado(department, title, desc, to, order, token);
      
      notification.success(`O seu chamado foi mandado para ${department}`);

      setTitle('');
      setTo('');
      setOrder(0);
      setDepartment('Suporte');
      setDesc('');

    } catch(err){
      notification.error("Ouve um erro ao tentar fazer o chamado, tente mais tarde!");
      console.error(err);
    }
  }
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "http://localhost:5173/";
  }

  const check = !title  ||  !to  ||  !desc;

  return (
    <div className="dark:text-white py-5 px-5">
      <h2 className='text-5xl text-center'>Chamados para TI</h2>
      <form className='mt-5 flex flex-col gap-5' onSubmit={onSubmit}>
        <div className='flex flex-col gap-3'>
          <label className='text-lg' htmlFor="title">Titulo do Chamado</label>
          <input onChange={e => setTitle(e.target.value)} value={title} className='p-2 outline-none text-black rounded border' type="text" id='title' placeholder='Descreva aqui com poucas palavra o que você quer!'/>
        </div>
        <div className='flex flex-col gap-3'>
          <label className='text-lg' htmlFor="department">Setor para onde será o chamado</label>
          <input onChange={e => setTo(e.target.value)} value={to} className='p-2 outline-none text-black rounded border' type="text" id='department' placeholder='Descreva aqui com poucas palavra o que você quer!'/>
        </div>
        <div className='flex flex-col gap-3'>
          <label className='text-lg' htmlFor="department">Escolha a urgencia do chamado</label>
          <select onChange={e => setOrder(e.target.value)} value={order} className='p-2 outline-none text-black rounded border'>
            <option value="0">Alto</option>
            <option value="1">Médio</option>
            <option value="2">Baixo</option>
          </select>
        </div>
        <div className='flex flex-col gap-3'>
          <label className='text-lg' htmlFor="department">Escolha o setor da TI</label>
          <select onChange={e => setDepartment(e.target.value)} value={department} className='p-2 outline-none text-black rounded border'>
            <option value="Suporte">Suporte de TI</option>
            <option value="Redes">Infraestrutura Redes</option>
            <option value="Desenvolvimento">Desenvolvimento</option>
          </select>
        </div>
        <div className='flex flex-col gap-3'>
          <label className='text-lg' htmlFor="department">Descreva seu chamado</label>
          <textarea onChange={e => setDesc(e.target.value)} value={desc} className='p-2 h-48 outline-none resize-none text-black rounded border' placeholder='Explique o que ocorreu e o motivo do chamado!'></textarea>
        </div>
        <div className='flex items-center justify-end gap-3'>
          <button disabled={check ? true : false} type="submit" className="text-center disabled:bg-green-600/20 bg-green-600 w-full text-white p-3 font-bold rounded transition-all hover:bg-green-800 lg:w-56">Enviar Chamado</button>
          <button onClick={logout} className="text-center bg-red-600 w-full text-white p-3 font-bold rounded transition-all hover:bg-red-800 lg:w-56">Sair</button>
        </div>
      </form>
    </div>
  )
}

export default Chamar;