package hr.mlinx.pinterestclone.service;

import hr.mlinx.pinterestclone.model.Post;

import java.util.List;

public interface PostService {

    List<Post> getPosts();
    List<Post> getPostsByUserId(Long userId);
    Post getPostById(Long postId);
    Post savePost(Post post);
    Post createPostByUserId(Post post, Long userId);
    void deletePostById(Long postId);
    void deleteYourPostById(Long postId, Long userId);
    void likePost(Long postId, Long userId);
    void unlikePost(Long postId, Long userId);

}
