import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import './PostForm.scss';
import makeConfig from "../../util/axiosConfig";
import {TOKEN_COOKIE_NAME, useAuth} from "../context/AuthProvider";
import axios from "axios";

const PostForm: React.FC = () => {
    const [postUrl, setPostUrl] = useState<string>('');
    const [postDescription, setPostDescription] = useState<string>('');
    const [posting, setPosting] = useState<boolean>(false);
    const {cookies, user} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setPosting(true);

        try {
            await axios(makeConfig('POST', '/api/user/createPost', cookies[TOKEN_COOKIE_NAME], {
                imageUrl: postUrl, description: postDescription
            }));

            setPosting(false);
            navigate('/' + user.id);
        } catch (error) {
            console.error(error);
            setPosting(false);
        }
    }

    return(
      <div className={'post_form'}>
          <form onSubmit={handleSubmit} disabled>
              <input
                  type="url"
                  placeholder="Post image URL (required)"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
              />
              <input
                  type="text"
                  placeholder="Caption (max. 100 characters)"
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
              />
              <button type="submit" disabled={posting || !postUrl || postDescription.length > 100}>
                  Post
              </button>
          </form>
      </div>
    );
}

export default PostForm;
