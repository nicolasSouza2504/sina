package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.course.section.Section;

public interface SectionRepository extends JpaRepository<Section, Long> {
}
