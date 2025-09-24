package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.course.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByName(String name);
}
