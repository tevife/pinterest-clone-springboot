package hr.mlinx.pinterestclone.security.oauth2;

import hr.mlinx.pinterestclone.controller.AuthController;
import hr.mlinx.pinterestclone.exception.OAuth2AuthenticationProcessingException;
import hr.mlinx.pinterestclone.model.User;
import hr.mlinx.pinterestclone.repository.RoleRepository;
import hr.mlinx.pinterestclone.security.CustomUserDetails;
import hr.mlinx.pinterestclone.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Component
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final List<OAuth2UserInfoExtractor> oAuth2UserInfoExtractors;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("Processing OAuth2.0 login request through {}", userRequest.getClientRegistration().getRegistrationId());

        OAuth2User oAuth2User = super.loadUser(userRequest);

        Optional<OAuth2UserInfoExtractor> oAuth2UserInfoExtractorOptional = oAuth2UserInfoExtractors.stream()
                .filter(oAuth2UserInfoExtractor -> oAuth2UserInfoExtractor.accepts(userRequest))
                .findFirst();

        if (oAuth2UserInfoExtractorOptional.isEmpty()) {
            throw new InternalAuthenticationServiceException("The OAuth2.0 provider is not supported yet");
        }

        CustomUserDetails customUserDetails = oAuth2UserInfoExtractorOptional.get().extractUserInfo(oAuth2User);
        User user = processOAuth2User(customUserDetails, userRequest);
        customUserDetails.setId(user.getId());
        return customUserDetails;
    }

    private User processOAuth2User(CustomUserDetails customUserDetails, OAuth2UserRequest userRequest) {
        Optional<User> userOptional = userService.getUserByEmail(customUserDetails.getEmail());
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();

            if (!user.getAuthProvider().name().equalsIgnoreCase(userRequest.getClientRegistration().getRegistrationId())) {
                throw new OAuth2AuthenticationProcessingException(
                        String.format("Looks like you're already signed up through %s with the following email: %s!",
                        user.getAuthProvider().name(), customUserDetails.getEmail()));
            }
        } else {
            user = new User();
            registerNewUser(user, customUserDetails);
        }

        return userService.saveUser(user);
    }

    private void registerNewUser(User newUser, CustomUserDetails customUserDetails) {
        if (userService.existsUserWithUsername(customUserDetails.getUsername())) {
            throw new OAuth2AuthenticationProcessingException(
                    String.format("The OAuth2.0 username %s you're trying to register with already exists in the application.",
                    customUserDetails.getUsername()));
        }

        newUser.setUsername(customUserDetails.getUsername());
        newUser.setEmail(customUserDetails.getEmail());
        newUser.setImageUrl(customUserDetails.getImageUrl());
        newUser.setAuthProvider(customUserDetails.getAuthProvider());
        AuthController.giveRoleOfUser(newUser, roleRepository);
    }

}
