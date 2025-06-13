import IUser, {ERoleName} from "../../models/IUser";
import React, {createContext, useContext, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {useCookies} from "react-cookie";
import ICredentials, {IToken} from "../../models/ICredentials";
import axios from "axios";
import makeConfig from "../../util/axiosConfig";

export const TOKEN_COOKIE_NAME: string = 'jwt';

const useValue = () => {
    const [user, setUser] = useState<IUser>();
    const [cookies, setCookies, removeCookie] = useCookies();
    const navigate = useNavigate();

    const  authenticate = async () => {
        try {
            if (typeof cookies[TOKEN_COOKIE_NAME] === 'undefined') {
                return;
            }
            const {data} = await axios<IUser>(makeConfig('GET', '/api/user/me', cookies[TOKEN_COOKIE_NAME]));
            setUser(data as IUser);
        } catch (error) {
            console.log(error);
            logout();
        }
    }

    const localLogin = async (credentials: ICredentials) => {
        try {
            const {data} = await axios<IToken>(makeConfig('POST', '/auth/login', undefined, credentials));
            const response = data as IToken;
            setCookies(TOKEN_COOKIE_NAME, response.token, {path: '/'});
            navigate('/');
            window.location.reload();
        } catch (error) {
            throw error;
        }
    }

    const localSignup = async (credentials: ICredentials) => {
        try {
            const {data} = await axios<IToken>(makeConfig('POST', '/auth/signup', undefined, credentials));
            const response = data as IToken;
            setCookies(TOKEN_COOKIE_NAME, response.token, {path: '/'});
            navigate('/');
            window.location.reload();
        } catch (error) {
            throw error;
        }
    }

    const logout = () => {
        setUser(undefined);
        removeCookie(TOKEN_COOKIE_NAME);
        navigate('/');
    }

    const isUser = (): boolean => {
        return typeof user !== 'undefined';
    }

    const isModerator = (): boolean => {
        return user?.roles.some(role => role.name === ERoleName.MOD) as boolean;
    }

    const isAdmin = (): boolean => {
        return user?.roles.some(role => role.name === ERoleName.ADMIN) as boolean;
    }

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
}

export const UserContext = createContext({} as ReturnType<typeof useValue>);
export const useAuth = () => useContext(UserContext);

export const UserProvider = (props: {children}) => {
    return (
        <UserContext.Provider value={useValue()}>
            {props.children}
        </UserContext.Provider>
    )
}
