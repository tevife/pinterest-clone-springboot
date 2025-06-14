import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import IPost from "../../models/IPost";
import {Tooltip} from "react-tooltip";
import {useAuth} from "../context/AuthProvider";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

interface PostProps {
    post: IPost;
    idx: number;
    currentUserId?: number;
}

const Post: React.FC<PostProps> = ({ post, idx, currentUserId }) => {
    const {userId} = useParams();
    const navigate = useNavigate();
    const {isUser, isModerator} = useAuth();

    return (
        <div className={"grid-item"}>
            <img
                src={post.imageUrl}
                alt={post.description}
                className={"pic"}
            />
            <div className={"description"}>
                {post.description}
            </div>
            <div className={"post_actions"}>
                <img
                    src={post.creator.imageUrl}
                    alt={post.creator.username}
                    className={"user_avatar"}
                    id={`my-anchor-element-${idx}`}
                    data-tooltip-content={`@${post.creator.username}`}
                    data-tooltip-place={"bottom"}
                    onClick={() => {
                        const creatorId = post.creator.id;

                        if (typeof userId !== 'undefined') {
                            if (userId !== `${creatorId}`) {
                                navigate('/' + creatorId);
                            }
                        } else {
                            navigate('/' + creatorId);
                        }
                    }}
                />
                <Tooltip anchorId={`my-anchor-element-${idx}`} clickable/>
                <div className={"action_buttons"}>
                    <LikeButton post={post} currentUserId={currentUserId || 0}/>
                    {
                        (isModerator() || (isUser() && post.creator.id === currentUserId)) &&
                        <DeleteButton postId={post.id}/>
                    }
                </div>
            </div>
        </div>
    );
}

export default Post;