import React from "react";
import {Navigate} from 'react-router-dom';
import {useAuth} from "../context/AuthProvider";

const UserRoute: React.FC =(props: {children}) => {
    return useAuth().isUser() ? props.children : <Navigate to={'/'} replace={true}/>
}

export default UserRoute;
