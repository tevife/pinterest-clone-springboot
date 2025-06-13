package hr.mlinx.pinterestclone.repository;

import hr.mlinx.pinterestclone.model.Post;
import hr.mlinx.pinterestclone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByCreator(User creator);
}
