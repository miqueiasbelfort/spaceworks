import {useState, useEffect, useContext} from 'react';
import ItemList from '../../components/ItemList';
import Form from '../../components/Form';

import {servicesUser} from '../../services/api';
import { notification } from '../../utils/notifications';
import { AuthContext } from '../../context/AuthContext';

import Loading from '../../components/Loading';

function Users() {

  const {user} = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
  const [btn1, setBtn1] = useState('Criar Novo Usuário');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  // form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState(0);

  // data
  const [skip] = useState(0);
  const [take] = useState(10);
  const [query, setQuery] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
  }

  const onForm = async () => {
    const token = localStorage.getItem('token')
    if(btn1 === "Criar Novo Usuário"){
      
      try {
        await servicesUser.createAUser(username, email, role, department, password, token);
        notification.success("Novo usuário criado.");
        setShowModal(false);
  
        setUsername('');
        setEmail('');
        setPassword('');
        setDepartment('');
        setRole('');
      
      } catch (error) {
        notification.error("Erro ao tentar criar usuário!");
        console.error(error);
      }

    } else {
      try {
        await servicesUser.updateUser(id, username, email, role, department, token);
        notification.success("Usuário Editado");
        setShowModal(false);
  
        setUsername('');
        setEmail('');
        setPassword('');
        setDepartment('');
        setRole('');
      
      } catch (error) {
        console.error(error);
        notification.error("Erro ao tentar editar usuário");
      }
    }
  }

  const fields = [
    {id: 1, label: 'Usuário', value: username, setValue: (e) => setUsername(e), type: 'text', placeholder: 'Nome do novo usuário deve ser unico!', isSelect: false, isMultiline: false},
    {id: 2, label: 'Email', value: email, setValue: (e) => setEmail(e), type: 'email', placeholder: 'Email para indentificar usuário', isSelect: false, isMultiline: false},
    {id: 3, label: 'Setor', value: department, setValue: (e) => setDepartment(e), type: 'text', placeholder: 'Qual o departamento do usuário', isSelect: false, isMultiline: false},
    {id: 4, label: 'Cargo', value: role, setValue: (e) => setRole(e), type: 'text', placeholder: 'Qual o cargo do usuário', isSelect: false, isMultiline: false},
    {id: 5, label: 'Senha', value: password, setValue: (e) => setPassword(e), type: 'password', placeholder: 'Senha do usuário', isSelect: false, isMultiline: false},
  ];

  const handleEditModal = (data) => {
    setBtn1('Editar Usuário')
    setShowModal(true);
    setId(data.id);
    setUsername(data.nome);
    setEmail(data.email);
    setDepartment(data.setor);
    setRole(data.cargo);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setUsername('');
    setEmail('');
    setDepartment('');
    setRole('');
    setPassword('');
  }

  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem('token');
    const res = await servicesUser.deleteAUser(id, token);
    if(res){
      notification.success('Usuário deletado.');
    } else {
      notification.error('Erro ao tentar deletar usuário!');
    }
  }

  useEffect(() => {
    (async function() {
      const token = localStorage.getItem('token')
      const response = await servicesUser.getAllUsers(token, skip, take, query);
      setUserData(response.data);
      setLoading(false);
    })()
  }, [query, take, skip])

  if(loading){
    return <Loading/>;
  }

  return (
    <div>
      <div className="mt-7 dark:text-white">
        <div className="px-10 lg:px-24">
          {/* Header */}
          <h1 className="text-xl">Todo os usuários</h1>
          <div className="flex flex-col gap-3 items-center justify-between mt-3 lg:flex-row lg:gap-0">
            <button disabled={user?.role === "Desenvolvedor" ? false : true}  onClick={() => setShowModal(true)} className="bg-red-600 disabled:bg-red-600/50 w-full text-white p-3 font-bold rounded transition-all hover:bg-red-800 lg:w-56">Adiciar Usuário <i className="bi bi-person-plus-fill ml-1"></i></button>
            <form className="flex items-center border px-5 border-slate-500 rounded w-full lg:w-72" onSubmit={onSubmit}>
              <input onChange={e => setQuery(e.target.value)} className="h-12 w-full p-3 bg-transparent outline-none lg:w-56" type="text" placeholder="Qual usuário você procura?"/>
              <button type="submit" className="h-12 w-6 flex items-center justify-center"><i className="bi bi-search"></i></button>
            </form>
          </div>
          {/* Main */}
          <div className='w-full mt-5'>
            <ul className={`flex flex-col items-center justify-center gap-5 mb-32`}>
              {userData.map((item) => (
                <ItemList 
                  key={item.id}
                  type='user' 
                  title='loream' 
                  name={item.nome}
                  email={item.email} 
                  date={item.criadoEm}
                  department={item.setor}
                  role={item.cargo}
                  editShowModal={() => handleEditModal(item)}
                  handleDeleteUser={() => handleDeleteUser(item.id)}
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
              title="Adicionar novo usuário" 
              actionToClose={handleCloseModal} 
              showModal 
              fields={fields}
              btn1={btn1}
              btn2='Voltar'
              onForm={onForm}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Users;