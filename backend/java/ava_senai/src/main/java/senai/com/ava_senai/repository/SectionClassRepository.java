package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.course.clazz.sectionclass.SectionClass;

import java.util.List;

public interface SectionClassRepository extends JpaRepository<SectionClass, Long> {
    List<SectionClass> findByClassId(Long classId);
}
