package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;

@Repository
public interface TaskContentRepository extends JpaRepository<TaskContent, Long> {
}
