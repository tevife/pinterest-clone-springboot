import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import IPost from "../../models/IPost";
import {Tooltip} from "react-tooltip";
import {useAuth} from "../context/AuthProvider";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

const Post: React.FC = (props: {
    post: IPost,
    idx: number,
    currentUserId?: number
}) => {
    const {userId} = useParams();
    const navigate = useNavigate();
    const {isUser, isModerator} = useAuth();

    return (
        <div className={"grid-item"}>
            <img
                src={props.post.imageUrl}
                alt={props.post.description}
                className={"pic"}
            />
            <div className={"description"}>
                {props.post.description}
            </div>
            <div className={"post_actions"}>
                <img
                    src={props.post.creator.imageUrl}
                    alt={props.post.creator.username}
                    className={"user_avatar"}
                    id={`my-anchor-element-${props.idx}`}
                    data-tooltip-content={`@${props.post.creator.username}`}
                    data-tooltip-place={"bottom"}
                    onClick={() => {
                        const creatorId = props.post.creator.id;

                        if (typeof userId !== 'undefined') {
                            if (userId !== `${creatorId}`) {
                                navigate('/' + creatorId);
                            }
                        } else {
                            navigate('/' + creatorId);
                        }
                    }}
                />
                <Tooltip anchorId={`my-anchor-element-${props.idx}`} clickable/>
                <div className={"action_buttons"}>
                    <LikeButton post={props.post} currentUserId={props.currentUserId}/>
                    {
                        (isModerator() || (isUser() && props.post.creator.id === props.currentUserId))
                        && <DeleteButton postId={props.post.id}/>
                    }
                </div>
            </div>
        </div>
    );
}

export default Post;
