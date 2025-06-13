import React, {useState} from "react";
import {TOKEN_COOKIE_NAME, useAuth} from "../context/AuthProvider";
import makeConfig from "../../util/axiosConfig";
import axios from "axios";
import IGenericApiResponse from "../../models/IGenericApiResponse";
import IPost from "../../models/IPost";
import './LikeButton.scss';

const LikeButton: React.FC = (props: {
    post: IPost,
    currentUserId: number
}) => {
    const [likes, setLikes] = useState<number>(props.post.likedByUsers.length);
    const [loading, setLoading] = useState<boolean>(false);
    const {cookies, isUser} = useAuth();
    const [liked, setLiked] = useState<boolean>(isUser() && props.post.likedByUsers.some(user => user.id === props.currentUserId));

    const handleLike = (liking: boolean) => {
        if (!isUser()) {
            return;
        }

        setLoading(true);

        (async () => {
            try {
                const {data} = await axios<IGenericApiResponse>(makeConfig(
                    'PUT', `/api/user/${liking ? '' : 'un'}likePost/${props.post.id}`, cookies[TOKEN_COOKIE_NAME]));
                const response = data as IGenericApiResponse;
                console.log(response.message);

                setLikes(likes + (liking ? 1 : -1));
                setLiked(liking);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }

    return (
        <button
            className={'like_button'}
            onClick={() => handleLike(!liked)}
            disabled={!isUser() || loading}
        >
            {
                loading
                    ? <i className={'fas fa-spinner fa-spin'}></i>
                    : <span className={liked ? 'liked' : ''}>
                    <i className={`fa-${liked ? 'solid' : 'regular'} fa-heart`}></i>
                        {likes}
                    </span>
            }
        </button>
    );
}

export default LikeButton;
