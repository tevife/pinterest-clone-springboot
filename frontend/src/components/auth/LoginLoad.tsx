import React from "react";
import './LoginLoad.scss';

const LoginLoad: React.FC = (props: {
    message: string
}) => {
    return (
        <div className={'login_load'}>
            <div className="lds-hourglass"></div>
            <p>{props.message}</p>
        </div>
    );
}

export default LoginLoad;
