package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;

import java.util.Optional;

public interface UserResponseRepository extends JpaRepository<UserResponse, Long> {
    boolean existsUserResponsesByTaskUserId(Long taskUserId);

    @Query(" SELECT ur FROM UserResponse ur " +
           " JOIN FETCH ur.userResponseContents cts " +
           " JOIN FETCH ur.taskUser tu " +
           " WHERE ur.id = :id ")
    Optional<UserResponse> findSummaryById(Long id);
}
