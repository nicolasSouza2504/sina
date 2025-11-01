package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.user.userclass.UserClass;

import java.util.List;

public interface UserClassRepository extends JpaRepository<UserClass, Long> {
    List<UserClass> findUserClassByUserId(Long userId);
}
