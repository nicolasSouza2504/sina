package senai.com.ava_senai.services.section;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import senai.com.ava_senai.domain.course.section.SectionRegisterDTO;
import senai.com.ava_senai.domain.course.section.SectionResponseDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SectionService implements ISectionService {

    @Override
    public SectionResponseDTO getSectionById(Long id) {
        return null;
    }

    @Override
    public List<SectionResponseDTO> getAllSections() {
        return List.of();
    }

    @Override
    public SectionResponseDTO createSection(SectionRegisterDTO sectionRegister) throws Exception {
        return null;
    }

    @Override
    public SectionResponseDTO updateSection(SectionRegisterDTO sectionRegister, Long id) {
        return null;
    }
}
