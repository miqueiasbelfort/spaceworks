import {useState, useEffect} from 'react';
import ItemList from '../../components/ItemList';
import Form from '../../components/Form';
import Loading from '../../components/Loading';

import { useNavigate } from 'react-router-dom';
import { servicesChamados } from '../../services/api';
import {notification} from '../../utils/notifications';

function Chamados() {

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataChamado, setDataChamado] = useState([]);

  //form
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(0);
  const [to, setTo] = useState('');
  const [department, setDepartment] = useState('');
  const [desc, setDesc] = useState('');

  const [query, setQuery] = useState(null);

  const onForm = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await servicesChamados.createChamado(department, title, desc, to, order, token);
      dataChamado.push(data);
      notification.success("Um novo chamado foi feito.");
    } catch (error) {
      notification.error("Erro ao tentar fazer chamado!");
      console.error(error)
    }
  }

  const fields = [
    {id: 1, label: 'Titulo do Chamado', value: title, setValue: (e) => setTitle(e), type: 'text', placeholder: 'Sobre o que é seu chamado?', isSelect: false, isMultiline: false},
    {id: 2, label: 'Setor para do chamado', value: to, setValue: (e) => setTo(e), type: 'text', placeholder: 'Para onde a equipe deve se direcionar?', isSelect: false, isMultiline: false},
    {id: 3, label: 'Tipo de Urgência', value: order, setValue: (e) => setOrder(e), type: 'text', placeholder: 'O quão urgente é sue chamado?', isSelect: true, isMultiline: false, options: ['Alto', 'Médio', 'Baixo'], values: [0,1,2]},
    {id: 4, label: 'Direcionado para', value: department, setValue: (e) => setDepartment(e), type: 'text', placeholder: 'Para qual serto esta direcionado?', isSelect: true, isMultiline: false, options: ['Suporte de TI', 'Infraestrutura Redes', 'Desenvolvimento'], values: ["Suporte", "Redes", "Desenvolvimento"]},
    {id: 5, label: 'Descreva o chamado', value: desc, setValue: (e) => setDesc(e), type: 'text', placeholder: 'Descreva de forma detalhada seu chamado', isSelect: false, isMultiline: true},
  ];

  const handleCloseModal = () => {
    setShowModal(false);
    console.log({title, department, order, desc});
    setTitle('');
    setDepartment('');
    setOrder('');
    setDesc('');
  }

  useEffect(() => {
    (async function(){
      const token = localStorage.getItem('token');
      const response = await servicesChamados.getAllChamadosOpen(token, 0, 10, query);
      setDataChamado(response.data);
      setLoading(false);
    })()
  }, [query])


  if(loading){
    return (
      <Loading/>
    )
  }

  return (
    <div>
      <div className="mt-7 dark:text-white">
          <div className="px-10 lg:px-24">
              {/* Header */}
              <h1 className="text-xl">Todo os chamados para TI</h1>
              <div className="flex flex-col gap-3 items-center justify-between mt-3 lg:flex-row lg:gap-0">
                  <button onClick={() => setShowModal(true)} className="bg-red-600 w-full text-white p-3 font-bold rounded transition-all hover:bg-red-800 lg:w-56">Criar Chamado <i className="bi bi-file-earmark-plus-fill"></i></button>
                  <div className="flex items-center border px-5 border-slate-500 rounded w-full lg:w-72">
                    <input onChange={e => setQuery(e.target.value)} className="h-12 w-full p-3 bg-transparent outline-none lg:w-56" type="text" placeholder="A procura do chamado?"/>
                    <button className="h-12 w-6 flex items-center justify-center"><i className="bi bi-search"></i></button>
                  </div>
              </div>
              {/* Main */}
              <div className='w-full mt-5'>
                <ul className={`flex flex-col items-center justify-center gap-5 mb-32`}>
                  {dataChamado.map((chamado) => (
                    <ItemList 
                      key={chamado.id}
                      type='chamado' 
                      order={chamado.ordem}
                      title={chamado.titulo}
                      name={chamado.usuario.nome} 
                      email={chamado.usuario.email} 
                      date={chamado.criadoEm}
                      department={chamado.setor}
                      role={chamado.usuario.cargo}
                      clickToPage={() => navigate(`/chamados/${chamado.id}`)}
                    />
                  ))}
                </ul>
              </div>
          </div>
      </div>
      {showModal && (
        <div className='absolute w-full h-full top-0 left-0 flex items-center justify-center'>
          <div className='w-full h-full fixed z-auto'>
            <Form 
              title="Criar Chamado" 
              actionToClose={handleCloseModal} 
              showModal 
              fields={fields}
              btn1='Enviar Chamado'
              btn2='Voltar'
              onForm={onForm}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Chamados;