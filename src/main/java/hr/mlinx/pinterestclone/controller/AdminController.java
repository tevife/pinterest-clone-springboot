package hr.mlinx.pinterestclone.controller;

import hr.mlinx.pinterestclone.model.RoleName;
import hr.mlinx.pinterestclone.model.User;
import hr.mlinx.pinterestclone.payload.GenericApiResponse;
import hr.mlinx.pinterestclone.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public Collection<User> getUsers() {
        log.info("Admin request to get all users");
        return userService.getUsers();
    }

    @PutMapping("/giveMod/{userId}")
    public ResponseEntity<GenericApiResponse> giveMod(@PathVariable Long userId) {
        log.info("Admin request to give moderator role to user {}", userId);
        userService.giveRoleByUserId(RoleName.ROLE_MODERATOR, userId);
        return ResponseEntity.ok(new GenericApiResponse("Successfully gave moderator role to user " + userId));
    }

    @PutMapping("/takeMod/{userId}")
    public ResponseEntity<GenericApiResponse> takeMod(@PathVariable Long userId) {
        log.info("Admin request to take moderator role from user {}", userId);
        userService.takeRoleByUserId(RoleName.ROLE_MODERATOR, userId);
        return ResponseEntity.ok(new GenericApiResponse("Successfully took moderator role from user " + userId));
    }

    @DeleteMapping("/userAccount/{userId}")
    public ResponseEntity<GenericApiResponse> deleteUser(@PathVariable Long userId) {
        log.info("Admin request to delete user {}", userId);
        userService.deleteUserById(userId);
        return ResponseEntity.ok(new GenericApiResponse("Successfully deleted user " + userId));
    }

}
