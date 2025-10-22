package senai.com.ava_senai.domain.course.section;

public record SectionResponseDTO(Long id, String name, Integer semester, Long courseId) {

    public SectionResponseDTO(Section section) {
        this(section.getId(), section.getName(), section.getSemester(), section.getCourseId());
    }
}
