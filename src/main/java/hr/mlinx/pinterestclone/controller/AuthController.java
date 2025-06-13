package hr.mlinx.pinterestclone.controller;


import hr.mlinx.pinterestclone.exception.BadRequestException;
import hr.mlinx.pinterestclone.exception.ResourceNotFoundException;
import hr.mlinx.pinterestclone.model.AuthProvider;
import hr.mlinx.pinterestclone.model.Role;
import hr.mlinx.pinterestclone.model.RoleName;
import hr.mlinx.pinterestclone.model.User;
import hr.mlinx.pinterestclone.payload.AuthResponse;
import hr.mlinx.pinterestclone.payload.LoginRequest;
import hr.mlinx.pinterestclone.payload.SignupRequest;
import hr.mlinx.pinterestclone.repository.RoleRepository;
import hr.mlinx.pinterestclone.security.TokenProvider;
import hr.mlinx.pinterestclone.service.UserService;
import hr.mlinx.pinterestclone.util.Defaults;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    private String authenticateAndGetToken(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        return tokenProvider.generate(authentication);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Request to login through LOCAL auth provider as {}" + loginRequest.getUsername());
        return ResponseEntity.ok(new AuthResponse(authenticateAndGetToken(loginRequest.getUsername(), loginRequest.getPassword())));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest signupRequest) {
        log.info("Request to register through LOCAL auth provider as {}", signupRequest.getUsername());

        if (userService.existsUserWithUsername(signupRequest.getUsername())) {
            throw new BadRequestException(String.format("Username %s already exists.", signupRequest.getUsername()));
        }
        if (userService.existsUserWithEmail(signupRequest.getEmail())) {
            throw new BadRequestException(String.format("Email %s already exists.", signupRequest.getEmail()));
        }

        User user = new User();

        user.setUsername(signupRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setEmail(signupRequest.getEmail());
        user.setImageUrl(Defaults.IMAGE_URL);
        user.setAuthProvider(AuthProvider.LOCAL);
        giveRoleOfUser(user, roleRepository);

        userService.saveUser(user);

        return ResponseEntity.ok(new AuthResponse(authenticateAndGetToken(signupRequest.getUsername(), signupRequest.getPassword())));
    }

    public static void giveRoleOfUser(User user, RoleRepository roleRepository) {
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("role", "name", RoleName.ROLE_USER.name()));
        roles.add(userRole);
        user.setRoles(roles);
    }

}
