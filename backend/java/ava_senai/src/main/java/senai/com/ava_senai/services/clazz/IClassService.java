package senai.com.ava_senai.services.clazz;

import senai.com.ava_senai.domain.course.clazz.ClassRegisterDTO;
import senai.com.ava_senai.domain.course.clazz.ClassResponseDTO;
import senai.com.ava_senai.domain.course.clazz.classassessment.ClassAssessmentResponseDTO;
import senai.com.ava_senai.domain.task.rankedtask.RankedKnowledgeTrail;

import java.util.List;

public interface IClassService {

    ClassResponseDTO createClass(ClassRegisterDTO classRegisterDTO);

    List<ClassResponseDTO> getTurmas();

    ClassResponseDTO getTurmaById(Long turmaId);

    ClassResponseDTO updateClass(ClassRegisterDTO clazz, Long turmaId);

    void deleteTurma(Long turmaId);

    ClassAssessmentResponseDTO getClassAssessment(Long turmaId);

    List<RankedKnowledgeTrail> getRankedKnowledgeTrails(Long classId);
}
