package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.user.student.StudentRecordHistory;

public interface StudentRecordHistoryRepository extends JpaRepository<StudentRecordHistory, Long> {
}
