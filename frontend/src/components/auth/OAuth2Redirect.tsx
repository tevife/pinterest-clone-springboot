import React, {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import {TOKEN_COOKIE_NAME, useAuth} from "../context/AuthProvider";
import LoginLoad from "./LoginLoad";

function useQueryParams() {
    const {search} = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

const OAuth2Redirect: React.FC = () => {
    const query = useQueryParams();
    const {setCookies} = useAuth();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        const errorParam: string = query.get('error');
        if (errorParam) {
            setErrorMessage(errorParam);
            return;
        }

        const token: string = query.get('token');
        setCookies(TOKEN_COOKIE_NAME, token, {path: '/'});
        navigate('/');
        window.location.reload();
    }, []);

    return (
        <>{
            typeof errorMessage !== 'undefined'
                ? <p style={{textAlign: 'center'}}>{errorMessage}</p>
                : <LoginLoad message={'Logging in through OAuth2.0...'}/>
        }
        </>
    );
}

export default OAuth2Redirect;
