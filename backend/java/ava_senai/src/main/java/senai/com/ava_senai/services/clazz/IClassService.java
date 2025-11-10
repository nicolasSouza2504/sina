package senai.com.ava_senai.services.clazz;

import senai.com.ava_senai.domain.course.clazz.ClassRegisterDTO;
import senai.com.ava_senai.domain.course.clazz.ClassResponseDTO;
import senai.com.ava_senai.domain.course.clazz.ClassResponseSummaryDTO;
import java.util.List;

public interface IClassService {

    ClassResponseDTO createClass(ClassRegisterDTO classRegisterDTO);

    List<ClassResponseDTO> getTurmas();

    ClassResponseDTO getTurmaById(Long turmaId);

    ClassResponseDTO updateClass(ClassRegisterDTO clazz, Long turmaId);

    void deleteTurma(Long turmaId);

    ClassResponseSummaryDTO getTurmaSummaryById(Long turmaId);
}
