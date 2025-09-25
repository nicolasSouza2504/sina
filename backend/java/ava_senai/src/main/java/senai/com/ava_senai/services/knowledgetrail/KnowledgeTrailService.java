package senai.com.ava_senai.services.knowledgetrail;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import senai.com.ava_senai.domain.course.section.Section;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrail;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrailRegisterDTO;
import senai.com.ava_senai.domain.task.knowledgetrail.KnowledgeTrailResponseDTO;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.NullListException;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.repository.KnowledgeTrailRepository;
import senai.com.ava_senai.repository.SectionRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class KnowledgeTrailService implements IKnowledgeTrailService {

    private final KnowledgeTrailRepository knowledgeTrailRepository;
    private final SectionRepository sectionRepository;

    @Override
    public KnowledgeTrailResponseDTO getKnowledgeTrailById(Long id) {

        KnowledgeTrail knowledgeTrail = knowledgeTrailRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Trilha do conhecimento não encontrada!"));

        return new KnowledgeTrailResponseDTO(knowledgeTrail);

    }

    @Override
    public List<KnowledgeTrailResponseDTO> getAllKnowledgeTrails() {
        List<KnowledgeTrailResponseDTO> knowledgeTrailList = knowledgeTrailRepository.findAll().stream().map(KnowledgeTrailResponseDTO::new).toList();

        if (knowledgeTrailList.isEmpty()) {
            throw new NullListException("Lista de trilhas do conhecimento esta vazia");
        }

        return knowledgeTrailList;

    }

    @Override
    public KnowledgeTrailResponseDTO createKnowledgeTrail(KnowledgeTrailRegisterDTO knowledgeTrailRegister) throws Exception {

        validateMandatoryFields(knowledgeTrailRegister);

        return Optional.of(knowledgeTrailRegister)
                .filter(knowledgeTrailRequest -> !knowledgeTrailRepository.existsByNameAndSectionId(knowledgeTrailRequest.name(), knowledgeTrailRequest.sectionId()))
                .map(knowledgeTrailRequest -> {

                    KnowledgeTrail knowledgeTrail = buildKnowledgeTrail(knowledgeTrailRequest);

                    knowledgeTrail = knowledgeTrailRepository.save(knowledgeTrail);

                    return new KnowledgeTrailResponseDTO(knowledgeTrail);

                })
                .orElseThrow(() -> new Exception("Sessão com este nome ja existe"));

    }

    private KnowledgeTrail buildKnowledgeTrail(KnowledgeTrailRegisterDTO knowledgeTrailRequest) {
        return new KnowledgeTrail(knowledgeTrailRequest.name(), knowledgeTrailRequest.sectionId());

    }

    private void validateMandatoryFields(KnowledgeTrailRegisterDTO knowledgeTrailRegister) {

        Validation validation = new Validation();

        if (knowledgeTrailRegister.name() == null || knowledgeTrailRegister.name().isBlank()) {
            validation.add("Name", "O nome da seção é obrigatório.");
        }

        if (knowledgeTrailRegister.sectionId() == null) {
            validation.add("Sessão", "A trilha deve estar vinculada a uma sessão");
        } else if (!sectionRepository.existsById(knowledgeTrailRegister.sectionId())) {
            validation.add("Sessão", "A sessão informada não existe");
        }

        validation.throwIfHasErrors();

    }

    @Override
    public KnowledgeTrailResponseDTO updateKnowledgeTrail(KnowledgeTrailRegisterDTO knowledgeTrailRegister, Long id) {

        validateMandatoryFields(knowledgeTrailRegister);

        return Optional.ofNullable(knowledgeTrailRepository.findById(id))
                .get()
                .map((knowledgeTrailDB) -> {

                    validateKnowledgeTrailSameName(knowledgeTrailRegister, knowledgeTrailDB);

                    knowledgeTrailDB = knowledgeTrailRepository.save(updateData(knowledgeTrailDB, knowledgeTrailRegister));

                    return new KnowledgeTrailResponseDTO(knowledgeTrailDB);

                })
                .orElseThrow(() -> new NotFoundException("Sessão não existe!"));

    }

    public void validateKnowledgeTrailSameName(KnowledgeTrailRegisterDTO knowledgeTrailRegister, KnowledgeTrail knowledgeTrailDB) {

        Boolean existsSectionWithSameNameDiffID = false;

        List<Section> knowledgeTrailsSameName = knowledgeTrailRepository.findByNameAndSectionId(knowledgeTrailRegister.name(), knowledgeTrailRegister.sectionId());

        if (!knowledgeTrailsSameName.isEmpty()) {

            final Long idDB = knowledgeTrailDB.getId();

            existsSectionWithSameNameDiffID = knowledgeTrailsSameName.stream()
                    .anyMatch(knowledgeTrailSameName -> !knowledgeTrailSameName.getId().equals(idDB));

        }

        if (existsSectionWithSameNameDiffID) {
            throw new RuntimeException("Já existe uma seção com este nome para este curso.");
        }

    }

    private KnowledgeTrail updateData(KnowledgeTrail knowledgeTrailDB, KnowledgeTrailRegisterDTO knowledgeTrailRegister) {
        knowledgeTrailDB.setName(knowledgeTrailRegister.name());
        knowledgeTrailDB.setSectionId(knowledgeTrailRegister.sectionId());
        return knowledgeTrailDB;
    }
}
