import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ThemeContext } from '../../hooks/useTheme';
import {AuthContext} from '../../context/AuthContext';

function Header() {
    const {theme, setTheme} = useContext(ThemeContext);
    const {user} = useContext(AuthContext);
    // <i class="bi bi-sunglasses"></i>

    const logout = () => {
      localStorage.removeItem("token");
      window.location.href = "http://localhost:5173/";
    }
    
  return (
    <div className='w-full h-10 shadow-sm p-3 flex flex-row justify-between items-center dark:text-white dark:shadow-slate-600'>
        <div className='flex items-center gap-5'>
          <Link to="/" className='text-xl font-bold dark:text-white'>Space<span className='text-red-600'>Works</span></Link>
          {user?.dapartment === "TI" && (
            <nav>
              <ul className='flex items-center gap-5'>
                <li className='font-semibold'>
                  <NavLink to="/users"  className={({ isActive, isPending }) => isPending ? "" : isActive ? "text-red-600" : ""}>Usuários</NavLink>  
                </li>
                <li className='font-semibold'>
                  <NavLink to="/chamados"  className={({ isActive, isPending }) => isPending ? "" : isActive ? "text-red-600" : ""}>Chamados</NavLink>  
                </li>
                <li className='font-semibold'>
                  <p onClick={logout} className='cursor-pointer hover:text-red-600'>Sair</p>  
                </li>
              </ul>
            </nav>
          )}
        </div>
        <button onClick={() => setTheme(theme == 'ligth' ? 'dark' : 'ligth')} className='text-lg'>
          {
            theme == 'ligth' ? <i className="bi bi-moon-stars-fill"></i> : <i className="bi bi-sunglasses text-white"></i>
          }
        </button>
    </div>
  )
}

export default Header;