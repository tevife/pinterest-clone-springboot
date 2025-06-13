package hr.mlinx.pinterestclone.service;

import hr.mlinx.pinterestclone.exception.BadRequestException;
import hr.mlinx.pinterestclone.exception.ResourceNotFoundException;
import hr.mlinx.pinterestclone.model.Role;
import hr.mlinx.pinterestclone.model.RoleName;
import hr.mlinx.pinterestclone.model.User;
import hr.mlinx.pinterestclone.repository.PostRepository;
import hr.mlinx.pinterestclone.repository.RoleRepository;
import hr.mlinx.pinterestclone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RequiredArgsConstructor
@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PostRepository postRepository;

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("user", "userId", userId));
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public boolean existsUserWithUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsUserWithEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteUserById(Long userId) {
        User user = getUserById(userId);
        postRepository.deleteAll(postRepository.findAllByCreator(user));
        userRepository.delete(user);
    }

    @Override
    public Set<Role> getRolesOfUser(User user) {
        Hibernate.initialize(user.getRoles());
        return user.getRoles();
    }

    private enum RoleAction {
        GIVE, TAKE
    }

    @Override
    public void giveRoleByUserId(RoleName name, Long userId) {
        modifyRole(name, userId, RoleAction.GIVE);
    }

    @Override
    public void takeRoleByUserId(RoleName name, Long userId) {
        modifyRole(name, userId, RoleAction.TAKE);
    }

    private void modifyRole(RoleName name, Long userId, RoleAction roleAction) {
        User user = getUserById(userId);
        Role role = getRoleByName(name);
        Set<Role> roles = getRolesOfUser(user);

        if (roleAction == RoleAction.GIVE) {
            if (roles.contains(role)) {
                throw new BadRequestException("User " + userId + " already has role " + name.name());
            }
            roles.add(role);
        } else if (roleAction == RoleAction.TAKE) {
            if (!roles.contains(role)) {
                throw new BadRequestException("User " + userId + " does not have role " + name.name());
            }
            roles.remove(role);
        }

        user.setRoles(roles);
        saveUser(user);
    }

    private Role getRoleByName(RoleName name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("role", "name", name.name()));
    }

    @Override
    public User changeUsername(Long userId, String username) {
        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException(String.format("Username %s already exists.", username));
        }

        User user = getUserById(userId);
        user.setUsername(username);
        return saveUser(user);
    }

    @Override
    public User changeImageUrl(Long userId, String imageUrl) {
        User user = getUserById(userId);
        user.setImageUrl(imageUrl);
        return saveUser(user);
    }

    @Override
    public void changePassword(User user, String password) {
        user.setPassword(password);
        saveUser(user);
    }

}
