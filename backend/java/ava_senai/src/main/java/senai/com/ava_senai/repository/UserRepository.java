package senai.com.ava_senai.repository;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;
import senai.com.ava_senai.domain.user.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    Optional<User> findById(Long id);

    boolean existsByEmail(@NotBlank(message = "Nome de Usuario deve ser preenchido") @Email(message = "Email deve ser Válido!") String email);

    @Query(
            nativeQuery = true,
            value = "SELECT * FROM users u " +
                    "WHERE (:name IS NULL OR UPPER(u.name) = UPPER(:name)) " +
                    "AND (:role IS NULL OR u.role_id = (:role)) " +
                    "AND (:idClass IS NULL OR EXISTS (SELECT 1 FROM user_class uc WHERE uc.user_id = u.id AND uc.class_id = :idClass)) " +
                    "AND (:idCourse IS NULL OR EXISTS (SELECT 1 FROM user_class uc JOIN class c ON uc.class_id = c.id WHERE uc.user_id = u.id AND c.course_id = :idCourse))"
    )
    List<User> findAll(
            @Param("name") String name,
            @Param("role") Long role,
            @Param("idClass") Long idClass,
            @Param("idCourse") Long idCourses

    );

    @Transactional
    @Modifying
    @Query("update User u set u.nameImage = ?1 where u.id = ?2")
    void updateNameImageById(@NonNull String nameImage, Long id);

    @Query(
            nativeQuery = true,
            value = " SELECT u FROM users u " +
                    " JOIN user_class uc ON u.id = uc.user_id " +
                    " JOIN class cl ON cl.id = uc.class_id " +
                    " JOIN course c ON c.id = cl.course_id " +
                    " WHERE c.id = :idCourse "
    )
    List<User> findByCourseId(@Param("idCourse") Long idCourse);

}
