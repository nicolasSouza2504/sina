package senai.com.ava_senai.services.knowledgetrail;

import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrailRegisterDTO;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrailResponseDTO;

import java.util.List;

public interface IKnowledgeTrailService {

    KnowledgeTrailResponseDTO getKnowledgeTrailById(Long id);

    List<KnowledgeTrailResponseDTO> getAllKnowledgeTrails();

    KnowledgeTrailResponseDTO createKnowledgeTrail(KnowledgeTrailRegisterDTO knowledgeTrailRegister) throws Exception;

    KnowledgeTrailResponseDTO updateKnowledgeTrail(KnowledgeTrailRegisterDTO knowledgeTrailRegister, Long id);

    List<KnowledgeTrailResponseDTO> getAllRankedKnowledgeTrailsByClassId(Long classId);
}
