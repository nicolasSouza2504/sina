package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;

import java.util.List;
import java.util.Optional;

public interface KnowledgeTrailRepository extends JpaRepository<KnowledgeTrail, Long> {
    boolean existsByNameAndSectionId(String name, Long sectionId);

    List<KnowledgeTrail> findByNameAndSectionId(String name, Long sectionId);

    @Query(" SELECT kt FROM UserResponse ur " +
           " JOIN ur.taskUser tu " +
           " JOIN tu.task t " +
           " JOIN t.knowledgeTrail kt " +
           " WHERE ur.id = :idUserResponse ")
    Optional<KnowledgeTrail> findByUserResponseId(Long idUserResponse);

    @Query(" SELECT kt FROM KnowledgeTrail kt " +
           " JOIN kt.section s " +
           " JOIN s.course co " +
           " JOIN co.classes cls" +
           " WHERE cls.id = :classId " +
           " AND kt.id IN :knowledgeTrailIds " +
           " AND kt.ranked = true ")
    Optional<List<KnowledgeTrail>> findRankedKnowledgeTrailsByClassId(Long classId, List<Long> knowledgeTrailIds);
}
