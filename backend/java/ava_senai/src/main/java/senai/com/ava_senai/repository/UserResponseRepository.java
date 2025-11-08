package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;

public interface UserResponseRepository extends JpaRepository<UserResponse, Long> {
    boolean existsUserResponsesByTaskUserId(Long taskUserId);
}
