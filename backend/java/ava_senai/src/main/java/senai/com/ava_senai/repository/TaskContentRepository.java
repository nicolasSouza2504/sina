package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;

public interface TaskContentRepository extends JpaRepository<TaskContent, Long> {
}
