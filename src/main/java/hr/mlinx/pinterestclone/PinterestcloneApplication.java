package hr.mlinx.pinterestclone;

import hr.mlinx.pinterestclone.exception.ResourceNotFoundException;
import hr.mlinx.pinterestclone.model.AuthProvider;
import hr.mlinx.pinterestclone.model.Role;
import hr.mlinx.pinterestclone.model.RoleName;
import hr.mlinx.pinterestclone.model.User;
import hr.mlinx.pinterestclone.repository.RoleRepository;
import hr.mlinx.pinterestclone.repository.UserRepository;
import hr.mlinx.pinterestclone.util.Defaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@SpringBootApplication
public class PinterestcloneApplication {

    public static void main(String[] args) {
        SpringApplication.run(PinterestcloneApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Cria roles se não existirem
            if (!roleRepository.existsByName(RoleName.ROLE_USER))
                roleRepository.save(new Role(RoleName.ROLE_USER));
            if (!roleRepository.existsByName(RoleName.ROLE_MODERATOR))
                roleRepository.save(new Role(RoleName.ROLE_MODERATOR));
            if (!roleRepository.existsByName(RoleName.ROLE_ADMIN))
                roleRepository.save(new Role(RoleName.ROLE_ADMIN));

            // Cria usuário admin se ainda não existir
            if (!userRepository.existsByUsername("admin")) {
                User user = new User();
                user.setUsername("admin");
                user.setPassword(passwordEncoder.encode("admin"));
                user.setEmail("admin@admin");
                user.setImageUrl(Defaults.IMAGE_URL);
                user.setAuthProvider(AuthProvider.LOCAL);

                Role modRole = roleRepository.findByName(RoleName.ROLE_MODERATOR)
                        .orElseThrow(() -> new ResourceNotFoundException("role", "name", RoleName.ROLE_MODERATOR.name()));
                Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                        .orElseThrow(() -> new ResourceNotFoundException("role", "name", RoleName.ROLE_ADMIN.name()));

                user.getRoles().add(modRole);
                user.getRoles().add(adminRole);

                userRepository.save(user);

                log.info("Created user 'admin' with admin and moderator roles (password: 'admin')");
            }
        };
    }
}
