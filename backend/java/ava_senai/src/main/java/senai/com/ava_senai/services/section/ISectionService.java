package senai.com.ava_senai.services.section;

import senai.com.ava_senai.domain.course.section.SectionRegisterDTO;
import senai.com.ava_senai.domain.course.section.SectionResponseDTO;

import java.util.List;

public interface ISectionService {

    SectionResponseDTO getSectionById(Long id);

    List<SectionResponseDTO> getAllSections();

    SectionResponseDTO createSection(SectionRegisterDTO sectionRegister) throws Exception;

    SectionResponseDTO updateSection(SectionRegisterDTO sectionRegister, Long id);

}
