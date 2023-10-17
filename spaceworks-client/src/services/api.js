import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5108/v1'
});

export const servicesAuth = {
    signIn: async (username, password) => {
        let data = null;
        
        await api.post('/user/signIn', {
            usuario: username,
            senha: password
        }).then(res => {
            localStorage.setItem('token', res.data.token);
            data = {id: res.data.id, username: res.data.nome, dapartment: res.data.setor};
        }).catch(err => {
            console.error(err);
            data = null;
        });

        return data;
    },
    userByToken: async (token) => {
        let data = null;
        
        await api.get('/user/user-by-token', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            data = {id: res.data.id, username: res.data.nome, dapartment: res.data.setor};
            // console.log({id: res.data.id, username: res.data.nome, dapartment: res.data.setor});
        }).catch(err => {
            console.error(err);
            data = null;
        });

        return data;
    }
}

export const servicesUser = {
    getAllUsers: async (token, skip = 0, take = 2, query = null) => {
       let data;

        let search = query !== null ? `?search=${query}` : '';

        await api.get(`/user/all-users/skip/${skip}/take/${take}${search}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            data = res.data;
        })
        .catch(err => {
            console.log(err);
            data = [];
        });

        return data;

    },
    getUserByID: async (id, token) => {
        
        const data = await api.get(`/user/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.data)
        .catch(err => {
            console.log(err);
            return null;
        });
        return data;

    },
    createAUser: async (username, email, role, dapartment, password, token) => {
        
        const data = await api.post('/user/signUp', {
            nome: username,
            email,
            cargo: role,
            setor: dapartment,
            senha: password
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.data).catch(err => {
            console.log(err);
            return null;
        })
        return data;

    },
    updateUser: async (id, username, email, role, dapartment, token) => {
        
        const data = await api.put(`/user/edit/${id}`, {
            nome: username,
            email,
            cargo: role,
            setor: dapartment,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.data).catch(err => {
            console.error(err);
            return null;
        });

        return data;
    },
    deleteAUser: async (id, token) => {
        const data = await api.delete(`/user/delete/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(() => {
            return true;
        }).catch(err => {
            console.log(err);
            return false;
        });
        return data;
    }
};

export const servicesChamados = {
    getAllChamadosOpen: async (token, skip = 0, take = 10, query = null) => {
        let data = [];

        const search = query !== null ? `?search=${query}` : '';

        await api.get(`/chamado/all-chamados/open/skip/${skip}/take/${take}${search}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            data = res.data;
            // console.log(res.data)
        }).catch(err => {
            console.error(err);
            data = { 
                total: 0,
                skip: 0,
                take: 0,
                data : [] 
            };
        })

        return data;
    },
    getChamadoById: async (id, token) => {
        let data = null;

        await api.get(`/chamado/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            data = res.data;
            // console.log(res.data)
        }).catch(err => {
            console.error(err);
            data = null;
        })

        return data;
    },
    createChamado: async (dapartment, title, desc, to, order, token) => {
        let data = null;
        await api.post('/chamado/create-chamado', {
            setor: to,
            titulo: title,
            descricao: desc,
            direcao: dapartment,
            status: true,
            ordem: parseInt(order),
            usuario: {
                nome: '',
                cargo: '',
                email: '',
                setor: ''
            }
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            data = res.data;
        }).catch(err => {
            console.error(err);
            data = null;
        })
        return data;
    },
    closeChamado: async (id, username, descr, token) => {
        let data = {};
        await api.put(`/chamado/close-chamado/${id}`, {
            responsavel: username,
            descricao: descr
        }, { headers: {'Authorization': `Bearer ${token}`} }
        ).then(res => {
            data = res.data;
        }).catch(err => {
            console.error(err);
            data = {};
        })
        return data;
    }
}

export default api;