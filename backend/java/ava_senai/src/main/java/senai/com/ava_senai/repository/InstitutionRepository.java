package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.course.institution.Institution;


public interface InstitutionRepository extends JpaRepository<Institution, Long> {
    boolean findByInstitutionName(String senaiJoinville);
}
