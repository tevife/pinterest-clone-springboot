import React, {useState} from "react";
import axios from "axios";
import makeConfig from "../../util/axiosConfig";
import IGenericApiResponse from "../../models/IGenericApiResponse";
import './DeleteButton.scss';
import {TOKEN_COOKIE_NAME, useAuth} from "../context/AuthProvider";

const DeleteButton: React.FC = (props: {
    postId: number
}) => {
    const [deleting, setDeleting] = useState<boolean>(false);
    const {isModerator, cookies} = useAuth();

    const handleDelete = () => {
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        setDeleting(true);

        (async () => {
            try {
                const route: string = `/api/${isModerator() ? 'mod' : 'user'}/post/${props.postId}`;
                const {data} = await axios<IGenericApiResponse>(makeConfig(
                    'DELETE', route, cookies[TOKEN_COOKIE_NAME]));
                const response = data as IGenericApiResponse;
                console.log(response.message);

                window.location.reload();
            } catch (error) {
                console.log(error);
            } finally {
                setDeleting(false);
            }
        })();
    }

    return (
        <button
            className={'delete_button'}
            onClick={handleDelete}
            disabled={deleting}
        >
            <i className={'fa-solid fa-trash'}></i>
        </button>
    );
}

export default DeleteButton;
