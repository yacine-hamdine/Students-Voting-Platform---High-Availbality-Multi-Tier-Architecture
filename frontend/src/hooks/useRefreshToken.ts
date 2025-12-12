import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await api.get('/auth/refresh');
        const accessToken = response.data.accessToken;
        setAuth(prev => {
            return { ...prev, accessToken: accessToken };
        });
        return accessToken;
    };
    return refresh;
};
