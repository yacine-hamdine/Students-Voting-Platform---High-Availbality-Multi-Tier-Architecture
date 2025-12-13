import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { api } from '../api/axios';

interface User {
    id?: number;
    username: string;
}

interface AuthState {
    accessToken?: string;
    user?: User;
}

interface AuthContextType {
    auth: AuthState;
    setAuth: Dispatch<SetStateAction<AuthState>>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthState>(() => {
        const token = localStorage.getItem('accessToken');
        return token ? { accessToken: token } : {};
    });

    useEffect(() => {
        if (auth.accessToken) {
            localStorage.setItem('accessToken', auth.accessToken);
        } else {
            localStorage.removeItem('accessToken');
        }
    }, [auth.accessToken]);

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setAuth({});
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
