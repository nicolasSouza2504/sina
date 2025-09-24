package senai.com.ava_senai.services.section;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.course.section.Section;
import senai.com.ava_senai.domain.course.section.SectionRegisterDTO;
import senai.com.ava_senai.domain.course.section.SectionResponseDTO;
import senai.com.ava_senai.exception.NotFoundException;
import senai.com.ava_senai.exception.NullListException;
import senai.com.ava_senai.exception.Validation;
import senai.com.ava_senai.repository.SectionRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SectionService implements ISectionService {

    private final SectionRepository sectionRepository;

    @Override
    public SectionResponseDTO getSectionById(Long id) {

        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Sessão não encontrada!"));

        return new SectionResponseDTO(section);

    }

    @Override
    public List<SectionResponseDTO> getAllSections() {

        List<SectionResponseDTO> sectionList = sectionRepository.findAll().stream().map(SectionResponseDTO::new).toList();

        if (sectionList.isEmpty()) {
            throw new NullListException("Lista de sessões Vazia");
        }

        return sectionList;

    }

    @Override
    public SectionResponseDTO createSection(SectionRegisterDTO sectionRegister) throws Exception {

        validateMandatoryFields(sectionRegister);

        return Optional.of(sectionRegister)
                .filter(sectionRequest -> !sectionRepository.existsByNameAndCourseId(sectionRequest.name(), sectionRequest.courseId()))
                .map(sectionRequest -> {

                    Section section = buildSection(sectionRequest);

                    section = sectionRepository.save(section);

                    return new SectionResponseDTO(section);

                })
                .orElseThrow(() -> new Exception("Sessão com este nome ja existe"));

    }

    private Section buildSection(SectionRegisterDTO sectionRegister) {

        Section section = new Section();

        section.setName(sectionRegister.name());
        section.setSemester(sectionRegister.semester());
        section.setCourseId(sectionRegister.courseId());

        return section;

    }

    private void validateMandatoryFields(SectionRegisterDTO sectionRegister) {

        Validation validation = new Validation();

        if (sectionRegister.name() == null || sectionRegister.name().isBlank()) {
            validation.add("Name", "O nome da seção é obrigatório.");
        }

        if (sectionRegister.courseId() == null) {
            validation.add("Curso", "A sessão deve estar vinculada a um curso.");
        }

        validation.throwIfHasErrors();

    }

    @Override
    public SectionResponseDTO updateSection(SectionRegisterDTO sectionRegister, Long id) {

        validateMandatoryFields(sectionRegister);

        return Optional.ofNullable(sectionRepository.findById(id))
                .get()
                .map((sectionDB) -> {

                    validateSectionSameName(sectionRegister, sectionDB);

                    sectionDB = sectionRepository.save(updateData(sectionDB, sectionRegister));

                    return new SectionResponseDTO(sectionDB);

                })
                .orElseThrow(() -> new NotFoundException("Sessão não existe!"));

    }

    public void validateSectionSameName(SectionRegisterDTO sectionRegister, Section sectionDB) throws RuntimeException {

        Boolean existsSectionWithSameNameDiffID = false;

        List<Section> sectionsSameName = sectionRepository.findByNameAndCourseId(sectionRegister.name(), sectionRegister.courseId());

        if (!sectionsSameName.isEmpty()) {

            final Long idDB = sectionDB.getId();

            existsSectionWithSameNameDiffID = sectionsSameName.stream()
                    .anyMatch(sectionSameName -> !sectionSameName.getId().equals(idDB));

        }

        if (existsSectionWithSameNameDiffID) {
            throw new RuntimeException("Já existe uma seção com este nome para este curso.");
        }

    }


    private Section updateData(Section sectionDB, SectionRegisterDTO sectionRegister) {

        sectionDB.setName(sectionRegister.name());
        sectionDB.setSemester(sectionRegister.semester());
        sectionDB.setCourseId(sectionRegister.courseId());

        return sectionDB;

    }


}
