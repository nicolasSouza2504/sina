package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.user.userclass.UserClass;

public interface UserClassRepository extends JpaRepository<UserClass, Long> {
}
