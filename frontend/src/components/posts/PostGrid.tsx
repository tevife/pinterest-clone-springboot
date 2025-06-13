import React, {useEffect, useState} from "react";
import IPost, {IPosts} from "../../models/IPost";
import axios from "axios";
import makeConfig from "../../util/axiosConfig";
import Masonry from "react-masonry-css";
import Post from "./Post";
import './PostGrid.scss';
import {useAuth} from "../context/AuthProvider";

const PostGrid: React.FC = (props: {
    userId?: number
}) => {
    const [posts, setPosts] = useState<IPosts>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const {user: currentUser} = useAuth();

    useEffect(() => {
        let route = "/api/public/posts"
            + (typeof props.userId === 'undefined' ? '' : '/' + props.userId);

        (async () => {
            try {
                const { data } = await axios<IPosts>(makeConfig(
                    'GET', route
                ));

                const posts = data as IPosts;
                setPosts(posts.reverse() as IPosts); // response has posts ordered older->newer
            } catch (error) {
                console.log(error.response.data.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <>
            {loading && <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>}
            <Masonry
                breakpointCols={{
                    default: 3,
                    700: 2,
                    420: 1
                }}
                className={"my-masonry-grid"}
                columnClassName={"my-masonry-grid_column"}
            >
                {
                    !loading &&
                    (posts.length > 0
                        ? posts.map((post: IPost, idx: number) =>
                            <Post post={post} key={post.id} idx={idx} currentUserId={currentUser?.id}/>)
                        : <p className={'no_posts'}>No posts.</p>)
                }
            </Masonry>
        </>
    );
}

export default PostGrid;
