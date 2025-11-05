package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.user.User;
import senai.com.ava_senai.domain.user.student.StudentRecord;

import java.util.List;

public interface StudentRecordRepository extends JpaRepository<StudentRecord, Long> {
    List<StudentRecord> findAllByStudent(User student);
}
