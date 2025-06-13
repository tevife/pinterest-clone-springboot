package hr.mlinx.pinterestclone.service;

import hr.mlinx.pinterestclone.model.Role;
import hr.mlinx.pinterestclone.model.RoleName;
import hr.mlinx.pinterestclone.model.User;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserService {

    List<User> getUsers();
    User getUserById(Long userId);
    Optional<User> getUserByUsername(String username);
    Optional<User> getUserByEmail(String email);
    boolean existsUserWithUsername(String username);
    boolean existsUserWithEmail(String email);
    User saveUser(User user);
    void deleteUserById(Long userId);
    Set<Role> getRolesOfUser(User user);
    void giveRoleByUserId(RoleName name, Long userId);
    void takeRoleByUserId(RoleName name, Long userId);
    User changeUsername(Long userId, String username);
    User changeImageUrl(Long userId, String imageUrl);
    void changePassword(User user, String password);

}
