package senai.com.ava_senai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senai.com.ava_senai.domain.clazz.Class;

public interface TurmaRepository  extends JpaRepository<Class, Long> {
    boolean existsByName(String turmaNome);

    boolean existsByNameLikeAndIdNot(String nome, Long turmaId);
}
