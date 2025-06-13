import React from "react";
import {Navigate} from 'react-router-dom';
import {useAuth} from "../context/AuthProvider";

const AdminRoute: React.FC =(props: {children}) => {
    return useAuth().isAdmin() ? props.children : <Navigate to={'/'} replace={true}/>
}

export default AdminRoute;
