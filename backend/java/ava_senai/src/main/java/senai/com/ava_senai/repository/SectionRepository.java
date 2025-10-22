package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.course.section.Section;

import java.util.List;

public interface SectionRepository extends JpaRepository<Section, Long> {
    boolean existsByName(String name);

    boolean existsByNameAndCourseId(String name, Long courseId);

    List<Section> findByNameAndCourseId(String name, Long courseId);
}
