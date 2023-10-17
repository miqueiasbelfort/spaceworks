import { createContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const navigate = useNavigate();
    const [logged, setLogged] = useState(false);
    const [user, setUser] = useState(null);

    const useLogin = async (username, password) => {
        await api.post('/user/signIn', {
            usuario: username,
            senha: password
        }).then(res => {
            
            localStorage.setItem('token', res.data.token);
            setUser({id: res.data.id, username: res.data.username, dapartment: res.data.setor, role: res.data.cargo});
            setLogged(true);

            if(res.data.setor === "TI"){
                navigate('/chamados');
            } else {
                navigate('/chamar');
            }
            
        }).catch(err => {
            console.error(err);
        })
    }

    useEffect(() => {
        const getUserByToken = async () => {
            const token = localStorage.getItem('token');
            if(token){
                await api.get('/user/user-by-token', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(res => {
                    setUser({id: res.data.id, username: res.data.nome, dapartment: res.data.setor, role: res.data.cargo});
                    console.log({id: res.data.id, username: res.data.nome, dapartment: res.data.setor, role: res.data.cargo});
                }).catch(err => {
                    console.error(err);
                })
            }
        }
        getUserByToken();
    }, [])

    return <AuthContext.Provider value={{useLogin, logged, user}}>
        {children}
    </AuthContext.Provider>
}