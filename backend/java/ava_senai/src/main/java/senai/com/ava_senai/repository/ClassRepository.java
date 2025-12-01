package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import senai.com.ava_senai.domain.course.clazz.Class;

public interface ClassRepository extends JpaRepository<Class, Long> {
    boolean existsByName(String turmaNome);

    boolean existsByNameLikeAndIdNot(String nome, Long turmaId);

    @Query(" SELECT c FROM Class c " +
           " JOIN FETCH c.course co " +
           " WHERE c.id = :classId ")
    Class findClassAssessment(Long classId);

}
