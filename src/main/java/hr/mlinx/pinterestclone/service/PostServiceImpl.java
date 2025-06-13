package hr.mlinx.pinterestclone.service;

import hr.mlinx.pinterestclone.exception.BadRequestException;
import hr.mlinx.pinterestclone.exception.ResourceNotFoundException;
import hr.mlinx.pinterestclone.model.Post;
import hr.mlinx.pinterestclone.model.User;
import hr.mlinx.pinterestclone.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Set;

@RequiredArgsConstructor
@Service
@Transactional
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserService userService;

    @Override
    public List<Post> getPosts() {
        return postRepository.findAll();
    }

    @Override
    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findAllByCreator(userService.getUserById(userId));
    }

    @Override
    public Post getPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("post", "postId", postId));
    }

    @Override
    public Post savePost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public Post createPostByUserId(Post post, Long userId) {
        User user = userService.getUserById(userId);
        post.setCreator(user);
        return savePost(post);
    }

    @Override
    public void deletePostById(Long postId) {
        Post post = getPostById(postId);
        postRepository.delete(post);
    }

    @Override
    public void deleteYourPostById(Long postId, Long userId) {
        Post post = getPostById(postId);

        if (!Objects.equals(post.getCreator().getId(), userId)) {
            throw new BadRequestException("You cannot delete post " + postId);
        }

        postRepository.delete(post);
    }

    private enum PostAction {
        LIKE, UNLIKE
    }

    @Override
    public void likePost(Long userId, Long postId) {
        modifyPostLikes(postId, userId, PostAction.LIKE);
    }

    @Override
    public void unlikePost(Long userId, Long postId) {
        modifyPostLikes(postId, userId, PostAction.UNLIKE);
    }

    private void modifyPostLikes(Long userId, Long postId, PostAction postAction) {
        User user = userService.getUserById(userId);
        Post post = getPostById(postId);
        Set<User> likedByUsers = getLikedByUsers(post);

        if (postAction == PostAction.LIKE) {
            if (likedByUsers.contains(user)) {
                throw new BadRequestException("You already liked post " + postId);
            }
            likedByUsers.add(user);
        } else if (postAction == PostAction.UNLIKE) {
            if (!likedByUsers.contains(user)) {
                throw new BadRequestException("You have not liked post " + postId);
            }
            likedByUsers.remove(user);
        }


        savePost(post);
    }

    private Set<User> getLikedByUsers(Post post) {
        Hibernate.initialize(post.getLikedByUsers());
        return post.getLikedByUsers();
    }

}
