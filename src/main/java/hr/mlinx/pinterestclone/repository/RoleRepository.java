package hr.mlinx.pinterestclone.repository;

import hr.mlinx.pinterestclone.model.Role;
import hr.mlinx.pinterestclone.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);

    boolean existsByName(RoleName name); // ← ADICIONE ESTA LINHA
}
