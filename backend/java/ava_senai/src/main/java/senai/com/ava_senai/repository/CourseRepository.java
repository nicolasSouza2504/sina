package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import senai.com.ava_senai.domain.course.Course;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByName(String name);

    @Query("SELECT c FROM Course c " +
            "LEFT JOIN FETCH c.sections s " +
            "LEFT JOIN FETCH s.knowledgeTrails kt " +
            "LEFT JOIN FETCH kt.tasks t " +
            "LEFT JOIN FETCH t.contents tc " +
            "WHERE c.id = :id")
    Optional<Course> findCourseWithContentById(Long id);

}
