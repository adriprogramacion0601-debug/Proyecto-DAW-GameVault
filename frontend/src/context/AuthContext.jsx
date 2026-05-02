import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [usuario, setUsuario] = useState(null);

    const login = (nuevoToken) => {
        localStorage.setItem('token', nuevoToken);
        setToken(nuevoToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUsuario(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, usuario, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}