import React from "react";
import {useNavigate} from 'react-router-dom';
import './NavBar.scss';
import {useAuth} from "./context/AuthProvider";

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const {isUser, isModerator, isAdmin, user, logout} = useAuth();

    const optionalLoginNavBtn = window.location.pathname === '/login'
        ? <></>
        : <button onClick={() => navigate('/login')}>
            Login
        </button>;

    return (
        <div className={'navbar'}>
            <div className={'navbar_left'}>
                <button onClick={() => navigate('/')}>
                    Home
                </button>
                {
                    isUser() &&
                    <button onClick={() => navigate('/createPost')}>
                        New Post
                    </button>
                }
                {
                    isModerator() &&
                    <button onClick={() => navigate('/moderator')}>
                        Mod
                    </button>
                }
                {
                    isAdmin() &&
                    <button onClick={() => navigate('/admin')}>
                        Admin
                    </button>
                }
            </div>
            <div className={'navbar_right'}>
                {
                    isUser() &&
                    <div className={'user_account_nav'}>
                        Logged in as <button onClick={() => navigate('/myAccount')}>{user?.username}</button>
                    </div>
                }
                {
                    isUser()
                        ? <button onClick={() => logout()}>
                            Logout
                        </button>
                        : optionalLoginNavBtn
                }
            </div>
        </div>
    );
}

export default NavBar;
