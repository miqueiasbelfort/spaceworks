import { useContext } from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {AuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';

import AuthPage from './pages/Auth';
import Chamados from './pages/Chamados';
import Chamado from './pages/Chamados/Chamado';
import Users from './pages/Users';
import Chamar from './pages/Chamados/Chamar';
import NotFound from './pages/PagesHelp/NotFound';

function App() {

  const {user} = useContext(AuthContext);

  const Private = ({children}) => {
    if(!user){
      return <Navigate to="/"/>
    }
    return children;
  }

  return (
    <>
        <Header/>
        
        <Routes>

          <Route path='/' element={!user ? <AuthPage/> : <Navigate to={user?.dapartment == "TI" ? "/chamados" : "/chamar"}/>}/>

          <Route path='/users' element={<Private><Users/></Private>}/>

          <Route path='/chamados' element={<Private><Chamados/></Private>}/>
          <Route path='/chamados/:id' element={<Private><Chamado/></Private>}/>
          <Route path='/chamar' element={<Private><Chamar/></Private>}/>

          <Route path='*' element={<NotFound/>}/>
          
        </Routes>  
        
        <ToastContainer />
    </>
  )
}

export default App
