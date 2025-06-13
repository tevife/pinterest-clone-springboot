import React, {useState} from "react";
import {Navigate} from 'react-router-dom';
import './Login.scss';
import ICredentials, {areInvalidCredentials} from "../../models/ICredentials";
import {useAuth} from "../context/AuthProvider";
import LoginLoad from "./LoginLoad";
import IError, {IErrors} from "../../models/IError";
import axios, {AxiosError} from "axios";
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";

const Login: React.FC = () => {
    if (useAuth().isUser()) {
        return <Navigate to={'/'} replace={true}/>
    }

    const [credentials, setCredentials] = useState<ICredentials>({
        username: '',
        password: '',
        email: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [loggingIn, setLoggingIn] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>();
    const {localLogin, localSignup} = useAuth();

    const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (areInvalidCredentials(credentials, false)) {
            return;
        }

        setLoading(true);
        try {
            await localLogin(credentials);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error: AxiosError = e as AxiosError;

                if (error.response.status === 401) {
                    setErrorMessage('Wrong password');
                } else {
                    const resError: IError = error.response.data as IError;
                    setErrorMessage(resError.message);
                }
            } else {
                console.error(e);
                setErrorMessage('Something went wrong');
            }
        }
        setLoading(false);
    }

    const handleSignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (areInvalidCredentials(credentials, true)) {
            return;
        }

        setLoading(true);
        try {
            await localSignup(credentials);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error: AxiosError = e as AxiosError;

                if (error.response.status === 401) {
                    setErrorMessage('Unknown error occurred');
                } else {
                    if (typeof error.response.data.errors === 'undefined') {
                        const resError: IError = error.response.data as IError;
                        setErrorMessage(resError.message);
                    } else {
                        const resErrors: IErrors = error.response.data as IErrors;
                        let newErrorMessage: string = '';
                        resErrors.errors.forEach(validationError => {
                            newErrorMessage += `${validationError.field} ${validationError.defaultMessage}\n`;
                        });
                        setErrorMessage(newErrorMessage);
                    }
                }
            } else {
                console.error(e);
                setErrorMessage('Something went wrong');
            }
        }
        setLoading(false);
    }

    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (typeof errorMessage !== 'undefined') {
            setErrorMessage(undefined);
        }
    }

    if (loading) {
        return (
            <LoginLoad message={'Logging in...'}/>
        );
    }

    const loginSlashSignupMessage = loggingIn
        ? <p>Don't have an account? <button onClick={() => {setLoggingIn(false); setErrorMessage(undefined);}}>Sign up</button></p>
        : <p>Already have an account? <button onClick={() => {setLoggingIn(true); setErrorMessage(undefined);}}>Log in</button></p>;

    return(
        <div className={'login'}>
            <form onSubmit={loggingIn ? handleLoginSubmit : handleSignupSubmit}>
                <input
                    type="text"
                    placeholder='Username'
                    value={credentials.username}
                    name={'username'}
                    onChange={handleChange}
                />
                {
                    !loggingIn &&
                    <input
                        type="email"
                        placeholder='Email'
                        value={credentials.email}
                        name={'email'}
                        onChange={handleChange}
                    />
                }
                <input
                    type="password"
                    placeholder='Password'
                    value={credentials.password}
                    name={'password'}
                    onChange={handleChange}
                />
                <button type="submit" disabled={areInvalidCredentials(credentials, !loggingIn)}>
                    {loggingIn ? 'Login' : 'Signup'}
                </button>
            </form>
            {
                typeof errorMessage !== 'undefined' &&
                <p style={{color: 'red', fontSize: '14px', fontWeight: 'bold', fontStyle: 'italic'}}>{errorMessage}</p>
            }
            <div className={'lss_msg'}>
                {loginSlashSignupMessage}
            </div>
            <p style={{fontStyle: 'italic', margin: '30px auto'}}>Or...</p>
            <div className={'social_login'}>
                <a href={import.meta.env.VITE_API_ORIGIN + '/oauth2/authorization/github'} className={'github_login_btn'}>
                    <FaGithub/> Login with GitHub
                </a>
                <a href={import.meta.env.VITE_API_ORIGIN + '/oauth2/authorization/google'} className={'google_login_btn'}>
                    <FcGoogle/> Login with Google
                </a>
            </div>
        </div>
    );
}

export default Login;
