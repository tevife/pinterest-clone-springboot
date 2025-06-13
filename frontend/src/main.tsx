import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import {CookiesProvider} from "react-cookie";
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "./components/context/AuthProvider";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <CookiesProvider>
                <BrowserRouter>
                    <UserProvider>
                        <App/>
                    </UserProvider>
                </BrowserRouter>
        </CookiesProvider>
    </React.StrictMode>,
);
