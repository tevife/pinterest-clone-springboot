package hr.mlinx.pinterestclone.controller;

import hr.mlinx.pinterestclone.exception.BadRequestException;
import hr.mlinx.pinterestclone.model.AuthProvider;
import hr.mlinx.pinterestclone.model.Post;
import hr.mlinx.pinterestclone.model.User;
import hr.mlinx.pinterestclone.payload.*;
import hr.mlinx.pinterestclone.security.CustomUserDetails;
import hr.mlinx.pinterestclone.service.PostService;
import hr.mlinx.pinterestclone.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final PostService postService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @GetMapping("/me")
    public ResponseEntity<User> me(@AuthenticationPrincipal CustomUserDetails currentUser) {
        log.info("User {} requested account information", currentUser.getId());
        return ResponseEntity.ok(userService.getUserById(currentUser.getId()));
    }

    @PatchMapping("/changeUsername")
    public ResponseEntity<User> changeUsername(@AuthenticationPrincipal CustomUserDetails currentUser, @Valid @RequestBody ChangeUsernameRequest changeUsernameRequest) {
        log.info("User {} requested username change", currentUser.getId());
        return ResponseEntity.ok(userService.changeUsername(currentUser.getId(), changeUsernameRequest.getUsername()));
    }

    @PatchMapping("/changeImageUrl")
    public ResponseEntity<User> changeImageUrl(@AuthenticationPrincipal CustomUserDetails currentUser, @Valid @RequestBody ChangeImageUrlRequest changeImageUrlRequest) {
        log.info("User {} requested imageUrl change", currentUser.getId());
        return ResponseEntity.ok(userService.changeImageUrl(currentUser.getId(), changeImageUrlRequest.getImageUrl()));
    }

    // the jwt generated before changing the password could still be valid, so that's sort of a problem,
    // maybe store the tokens in a table and then for every token not only validate the token itself but also check if
    // it's stored so that we can remove it from the database when changing passwords, maybe logging out, etc.
    @PatchMapping("/changePassword")
    public ResponseEntity<GenericApiResponse> changePassword(@AuthenticationPrincipal CustomUserDetails currentUser, @Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        log.info("User {} requested password change", currentUser.getId());

        User user = userService.getUserById(currentUser.getId());

        if (user.getAuthProvider() != AuthProvider.LOCAL) {
            throw new BadRequestException("Users authenticated through OAuth2.0 (Social login) cannot authenticate with passwords.");
        }

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(currentUser.getUsername(), changePasswordRequest.getOldPassword()));
        userService.changePassword(user, passwordEncoder.encode(changePasswordRequest.getNewPassword()));

        return ResponseEntity.ok(new GenericApiResponse("Successfully changed password"));
    }

    @DeleteMapping("/account")
    public ResponseEntity<GenericApiResponse> deleteYourAccount(@AuthenticationPrincipal CustomUserDetails currentUser) {
        log.info("User {} requested account deletion", currentUser.getId());
        userService.deleteUserById(currentUser.getId());
        return ResponseEntity.ok(new GenericApiResponse("Successfully deleted user " + currentUser.getId()));
    }

    @PostMapping("/createPost")
    public ResponseEntity<Post> createPost(@Valid @RequestBody CreatePostRequest postRequest, @AuthenticationPrincipal CustomUserDetails currentUser) {
        log.info("User {} requested to create a post ('{}')", currentUser.getId(), postRequest.getDescription());

        Post post = new Post();
        post.setImageUrl(postRequest.getImageUrl());
        post.setDescription(postRequest.getDescription());

        return ResponseEntity.ok(postService.createPostByUserId(post, currentUser.getId()));
    }

    @PutMapping("/likePost/{postId}")
    public ResponseEntity<GenericApiResponse> likePost(@AuthenticationPrincipal CustomUserDetails currentUser, @PathVariable Long postId) {
        log.info("User {} requested to like post {}", currentUser.getId(), postId);
        postService.likePost(postId, currentUser.getId());
        return ResponseEntity.ok(new GenericApiResponse("Successfully liked post " + postId));
    }

    @PutMapping("/unlikePost/{postId}")
    public ResponseEntity<GenericApiResponse> unlikePost(@AuthenticationPrincipal CustomUserDetails currentUser, @PathVariable Long postId) {
        log.info("User {} requested to unlike post {}", currentUser.getId(), postId);
        postService.unlikePost(postId, currentUser.getId());
        return ResponseEntity.ok(new GenericApiResponse("Successfully unliked post " + postId));
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<GenericApiResponse> deleteYourPost(@AuthenticationPrincipal CustomUserDetails currentUser, @PathVariable Long postId) {
        log.info("User {} requested to delete post {}", currentUser.getId(), postId);
        postService.deleteYourPostById(postId, currentUser.getId());
        return ResponseEntity.ok(new GenericApiResponse("Successfully deleted post " + postId));
    }

}
