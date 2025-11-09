package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.task.taskuser.TaskUser;

public interface TaskUserRepository extends JpaRepository<TaskUser, Long> {
    Boolean existsByTaskIdAndUserId(Long taskId, Long userId);

    TaskUser findByUserIdAndTaskId(Long userId, Long taskId);
}
