import IUser, { ERoleName } from "../../models/IUser";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import ICredentials, { IToken } from "../../models/ICredentials";
import axios from "axios";
import makeConfig from "../../util/axiosConfig";

export const TOKEN_COOKIE_NAME: string = 'jwt';

const useValue = () => {
    const [user, setUser] = useState<IUser>();
    const [cookies, setCookies, removeCookie] = useCookies();
    const navigate = useNavigate();

    const authenticate = async () => {
        try {
            const token = cookies[TOKEN_COOKIE_NAME];
            if (typeof token === 'undefined') return;

            // Setar token globalmente
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const { data } = await axios<IUser>('/api/user/me');
            setUser(data as IUser);
        } catch (error) {
            console.log(error);
            logout();
        }
    };

    const localLogin = async (credentials: ICredentials) => {
        try {
            const { data } = await axios<IToken>(makeConfig('POST', '/auth/login', undefined, credentials));
            const response = data as IToken;

            setCookies(TOKEN_COOKIE_NAME, response.token, { path: '/' });

            // Setar token globalmente após login
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;

            navigate('/');
            window.location.reload();
        } catch (error) {
            throw error;
        }
    };

    const localSignup = async (credentials: ICredentials) => {
        try {
            const { data } = await axios<IToken>(makeConfig('POST', '/auth/signup', undefined, credentials));
            const response = data as IToken;

            setCookies(TOKEN_COOKIE_NAME, response.token, { path: '/' });

            // Setar token globalmente após signup
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;

            navigate('/');
            window.location.reload();
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(undefined);
        removeCookie(TOKEN_COOKIE_NAME);
        delete axios.defaults.headers.common['Authorization'];
        navigate('/');
    };

    const isUser = (): boolean => typeof user !== 'undefined';

    const isModerator = (): boolean => {
        return user?.roles.some(role => role.name === ERoleName.MOD) || false;
    };

    const isAdmin = (): boolean => {
        return user?.roles.some(role => role.name === ERoleName.ADMIN) || false;
    };

    return {
        user,
        cookies,
        setCookies,
        authenticate,
        localLogin,
        localSignup,
        logout,
        isUser,
        isModerator,
        isAdmin
    };
};

export const UserContext = createContext({} as ReturnType<typeof useValue>);
export const useAuth = () => useContext(UserContext);

interface Props {
    children: ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
    return (
        <UserContext.Provider value={useValue()}>
            {children}
        </UserContext.Provider>
    );
};