package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import senai.com.ava_senai.domain.task.taskcontent.TaskContent;

import java.util.Optional;

@Repository
public interface TaskContentRepository extends JpaRepository<TaskContent, Long> {
    Optional<TaskContent> findByIdentifier(String identifier);
}
