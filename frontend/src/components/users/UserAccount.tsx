import React, {useState} from "react";
import './UserAccount.scss';
import {TOKEN_COOKIE_NAME, useAuth} from "../context/AuthProvider";
import makeConfig from "../../util/axiosConfig";
import axios from "axios";

const UserAccount: React.FC = () => {
    const {cookies, logout} = useAuth();
    const [deleting, setDeleting] = useState<boolean>(false);

    const handleDeleteAccount = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (!window.confirm('Are you sure you want to delete your account?')) {
            return;
        }

        setDeleting(true);

        try {
            await axios(makeConfig('DELETE', '/api/user/account', cookies[TOKEN_COOKIE_NAME]));
            logout();
        } catch (error) {
            console.error(error);
            setDeleting(false);
        }
    }

    return (
        <div className={'user_account'}>
            <p>Work in progress...</p>
            <button onClick={handleDeleteAccount} disabled={deleting}>Delete your account</button>
        </div>
    );
}

export default UserAccount;
