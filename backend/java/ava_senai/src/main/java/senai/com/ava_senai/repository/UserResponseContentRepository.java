package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContent;

public interface UserResponseContentRepository extends JpaRepository<UserResponseContent, Long> {
}
