import React from "react";
import {Navigate} from 'react-router-dom';
import PostGrid from "../posts/PostGrid";
import {useParams} from "react-router-dom";

const UserPosts: React.FC = () => {
    const {userId} = useParams<{ userId?: string }>();

    if (!userId) {
        return <Navigate to={'/'} replace={true} />;
    }

    const userIdParsed = parseInt(userId);

    if (isNaN(userIdParsed)) {
        return <Navigate to={'/'} replace={true} />;
    }

    return (
        <PostGrid userId={userIdParsed} />
    );
}

export default UserPosts;