import {useState, useEffect} from 'react';
import { useParams, Link } from "react-router-dom";
import Form from "../../components/Form";
import Loading from '../../components/Loading';
import {servicesChamados} from '../../services/api';
import { notification } from '../../utils/notifications';

function Chamado() {

  const {id} = useParams();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [dataChamado, setDataChamado] = useState({}); 

  //form
  const [username, setUsername] = useState('');
  const [descr, setDescr] = useState('');

  const onForm = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await servicesChamados.closeChamado(id, username, descr, token);
      setDataChamado(data);
      notification.success(`O Chamado Cód: (${id}) foi fechado.`);
    } catch (error) {
      notification.error("Ouve um erro ao tentar fechar o chamado!");
      console.error(error);
    }
  }

  const fields = [
    {id: 1, label: 'Usuário', value: username, setValue: (e) => setUsername(e), type: 'text', placeholder: 'Nome do usuário que fechou o projeto', isSelect: false, isMultiline: false},
    {id: 2, label: 'Descrição', value: descr, setValue: (e) => setDescr(e), type: 'text', placeholder: 'Descrição do procedimento para fechar o chamado', isSelect: false, isMultiline: true},
  ];

  const handleCloseModal = () => {
    setShowModal(false);
  }

  useEffect(() => {
    (async function(){
      const token = localStorage.getItem('token');
      const data = await servicesChamados.getChamadoById(id, token);
      setDataChamado(data);
      setLoading(false)
    })()
  }, [id])

  if(loading){
    return <Loading/>
  }

  return (
    <div className="mt-7 dark:text-white px-10">
      
      <h1 className="text-3xl">{dataChamado.titulo}</h1>
      <p className="mt-4">Local: <span className="text-red-600 font-bold dark:font-normal">{dataChamado.setor}</span> - Tipo: <span className="text-red-600 font-bold dark:font-normal">{dataChamado.ordem}</span> - Para: <span className="text-red-600 font-bold dark:font-normal">{dataChamado.direcao}</span> - Status: <span className="text-red-600 font-bold dark:font-normal">{dataChamado.status ? 'Aberto' : 'Fechado'}</span> - Dia e hora: <span className="text-red-600 font-bold dark:font-normal">{dataChamado.criadoEm}</span></p>
      
      <h2 className="mt-4 font-bold">Descrição:</h2>
      <p className="mt-2 max-w-3xl">{dataChamado.descricao}</p>
      
      <div className="mt-4 flex flex-col gap-4 border-t">
        <h2 className="mt-4 font-bold">Sobre o usuário:</h2>
        <span>Usuário: <span className="text-red-600 font-bold">{dataChamado.usuario?.nome}</span></span>
        <span>Email: <span className="text-red-600 font-bold">{dataChamado.usuario?.email}</span></span>
        <span>Cargo: <span className="text-red-600 font-bold">{dataChamado.usuario?.cargo}</span></span>
        <span>Setor: <span className="text-red-600 font-bold">{dataChamado.usuario?.setor}</span></span>
      </div>

      {dataChamado.ordemDeFechar !== null && (
        <div className="mt-4 flex flex-col gap-3 border-t">
          <h2 className="mt-4 font-bold">Fechado por: {dataChamado.ordemDeFechar?.responsavel}</h2>
          <span>Horario: <span className="text-red-600 font-bold dark:font-normal">{dataChamado.ordemDeFechar?.fechadoEm}</span></span>
          <p>{dataChamado.ordemDeFechar?.descricao}</p>
        </div>
      )}

      <div className="mt-4 flex justify-end mb-10 gap-4 items-center">
        {dataChamado.ordemDeFechar === null && <button onClick={() => setShowModal(true)} className="bg-yellow-600 w-full text-white p-3 font-bold rounded transition-all hover:bg-yellow-800 lg:w-56">Fechar Chamado</button>}
        <Link to="/chamados" className="text-center bg-red-600 w-full text-white p-3 font-bold rounded transition-all hover:bg-red-800 lg:w-56">Todos os Chamados</Link>
      </div>

      {showModal && (
        <div className='absolute w-full h-full top-0 left-0 flex items-center justify-center'>
          <div className='w-full h-full fixed z-auto'>
            <Form 
              title={`Fechar chamado cód: ${id}`} 
              actionToClose={handleCloseModal} 
              showModal 
              fields={fields}
              btn1='Fechar Chamado'
              btn2='Voltar'
              onForm={onForm}
            />
          </div>
        </div>
      )}

    </div>
  )
}

export default Chamado;