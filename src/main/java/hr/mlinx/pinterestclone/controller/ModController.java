package hr.mlinx.pinterestclone.controller;

import hr.mlinx.pinterestclone.model.User;
import hr.mlinx.pinterestclone.payload.GenericApiResponse;
import hr.mlinx.pinterestclone.service.PostService;
import hr.mlinx.pinterestclone.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/mod")
public class ModController {

    private final UserService userService;
    private final PostService postService;

    @GetMapping("/users")
    public Collection<User> getUsers() {
        log.info("Moderator request to get all users");
        return userService.getUsers();
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<GenericApiResponse> deletePost(@PathVariable Long postId) {
        log.info("Moderator request to delete post {}", postId);
        postService.deletePostById(postId);
        return ResponseEntity.ok(new GenericApiResponse("Successfully deleted post " + postId));
    }

}
