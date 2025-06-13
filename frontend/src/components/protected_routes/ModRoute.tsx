import React from "react";
import {Navigate} from 'react-router-dom';
import {useAuth} from "../context/AuthProvider";

const ModRoute: React.FC =(props: {children}) => {
    return useAuth().isModerator() ? props.children : <Navigate to={'/'} replace={true}/>
}

export default ModRoute;
