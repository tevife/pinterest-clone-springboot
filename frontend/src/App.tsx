import './App.scss';
import React, {useEffect, useState} from "react";
import {Routes, Route} from "react-router-dom";
import NavBar from "./components/NavBar";
import NoPage from "./components/NoPage";
import Home from "./components/home/Home";
import UserPosts from "./components/users/UserPosts";
import PostForm from "./components/users/PostForm";
import OAuth2Redirect from "./components/auth/OAuth2Redirect";
import Login from "./components/auth/Login";
import UserAccount from "./components/users/UserAccount";
import ModPage from "./components/moderators/ModPage";
import AdminPage from "./components/admins/AdminPage";
import UserRoute from "./components/protected_routes/UserRoute";
import ModRoute from "./components/protected_routes/ModRoute";
import AdminRoute from "./components/protected_routes/AdminRoute";
import {useAuth} from "./components/context/AuthProvider";

const App: React.FC = () => {
    const {authenticate} = useAuth();
    const [authenticating, setAuthenticating] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            await authenticate();
            setAuthenticating(false);
        })();
    }, []);

    return (
        <div className={'app'}>
            {
                authenticating
                    ? <div className={'auth_load'}>
                        <div className="lds-dual-ring"></div>
                    <p>Authenticating...</p>
                    </div>
                    : <>
                        <NavBar/>
                        <Routes>
                            <Route path={'/'} element={<Home/>}/>
                            <Route path={'/:userId'} element={<UserPosts/>}/>
                            <Route path={'/login'} element={<Login/>}/>
                            <Route path={'/oauth2/redirect'} element={<OAuth2Redirect/>}/>
                            <Route path={'/createPost'} element={<UserRoute><PostForm/></UserRoute>}/>
                            <Route path={'/myAccount'} element={<UserRoute><UserAccount/></UserRoute>}/>
                            <Route path={'/moderator'} element={<ModRoute><ModPage/></ModRoute>}/>
                            <Route path={'/admin'} element={<AdminRoute><AdminPage/></AdminRoute>}/>
                            <Route path={'*'} element={<NoPage/>}/>
                        </Routes>
                    </>
            }
        </div>
    );
}

export default App;
