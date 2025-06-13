package hr.mlinx.pinterestclone.controller;

import hr.mlinx.pinterestclone.model.Post;
import hr.mlinx.pinterestclone.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public")
public class PublicController {

    private final PostService postService;

    @GetMapping("/posts")
    public Collection<Post> getPosts() {
        log.info("Request to get all posts");
        return postService.getPosts();
    }

    @GetMapping("/posts/{userId}")
    public Collection<Post> getUserPosts(@PathVariable Long userId) {
        log.info("Request to get all posts by user id {}", userId);
        return postService.getPostsByUserId(userId);
    }

}
