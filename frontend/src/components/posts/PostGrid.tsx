import React, {useEffect, useState} from "react";
import IPost from "../../models/IPost";
import axios from "axios";
import makeConfig from "../../util/axiosConfig";
import Masonry from "react-masonry-css";
import Post from "./Post";
import './PostGrid.scss';
import {useAuth} from "../context/AuthProvider";

interface PostGridProps {
    userId?: number;
}

const PostGrid: React.FC<PostGridProps> = ({ userId }) => {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const {user: currentUser} = useAuth();

    useEffect(() => {
        const route = userId ? `/api/public/posts/${userId}` : "/api/public/posts";

        (async () => {
            try {
                const { data } = await axios<IPost[]>(makeConfig('GET', route));
                setPosts([...data].reverse()); // ordenação do mais novo para o mais antigo
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    console.log((error.response.data as any).message);
                } else {
                    console.log(error);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    return (
        <>
            {loading && <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>}
            <Masonry
                breakpointCols={{
                    default: 3,
                    700: 2,
                    420: 1
                }}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {!loading && (
                    posts.length > 0
                        ? posts.map((post, idx) => (
                            <Post
                                key={post.id}
                                post={post}
                                idx={idx}
                                currentUserId={currentUser?.id}
                            />
                        ))
                        : <p className="no_posts">No posts.</p>
                )}
            </Masonry>
        </>
    );
}

export default PostGrid;