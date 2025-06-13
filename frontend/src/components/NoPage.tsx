import React from "react";
import {NavLink} from "react-router-dom";

const NoPage: React.FC = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: 'black' }}>Oops, seems you might have gotten lost.</h1>
            <NavLink to='/'>Go back to the app.</NavLink>
        </div>
    );
}

export default NoPage;
