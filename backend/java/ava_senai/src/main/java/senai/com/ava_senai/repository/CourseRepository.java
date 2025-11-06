package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import senai.com.ava_senai.domain.course.Course;
import senai.com.ava_senai.domain.course.CourseResponseDTO;
import senai.com.ava_senai.domain.course.clazz.Class;

import java.util.Collection;
import java.util.List;
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

    @Query(
            nativeQuery = true,
            value = " SELECT t.id FROM task t " +
                    " JOIN knowledge_trail kt ON kt.id = t.knowledge_trail_id " +
                    " JOIN section s ON s.id = kt.section_id " +
                    " JOIN course c ON c.id = s.course_id " +
                    " WHERE c.id = :courseId "
    )
    List<Long> findAllTaskIdsByCourseId(Long courseId);

    @Query("SELECT c FROM Course c " +
            "LEFT JOIN FETCH c.sections s " +
            "LEFT JOIN FETCH s.knowledgeTrails kt " +
            "LEFT JOIN FETCH kt.tasks t " +
            "LEFT JOIN FETCH t.contents tc " +
            "WHERE c.id = :courseId" +
            " AND EXISTS ( " +
            "     SELECT 1 FROM TaskUser tu " +
            "     WHERE tu.userId = :userId " +
            "     AND tu.taskId = t.id " +
            " ) ")
    Optional<Course> findCourseWithContentOfUserById(Long userId, Long courseId);

    @Query("SELECT new senai.com.ava_senai.domain.course.CourseResponseDTO(c) FROM Course c " +
            " JOIN c.classes cls" +
            " WHERE cls.id IN :classesIds")
    List<CourseResponseDTO> findAllByClassesIds(List<Long> classesIds);
}
