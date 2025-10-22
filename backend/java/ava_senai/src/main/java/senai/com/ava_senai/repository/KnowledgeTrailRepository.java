package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;

import java.util.List;

public interface KnowledgeTrailRepository extends JpaRepository<KnowledgeTrail, Long> {
    boolean existsByNameAndSectionId(String name, Long sectionId);

    List<KnowledgeTrail> findByNameAndSectionId(String name, Long sectionId);
}
