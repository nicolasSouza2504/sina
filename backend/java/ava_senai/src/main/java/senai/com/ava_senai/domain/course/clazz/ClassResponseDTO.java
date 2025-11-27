package senai.com.ava_senai.domain.course.clazz;

import senai.com.ava_senai.domain.course.section.SectionResponseDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public record ClassResponseDTO(Long Id, String nome, LocalDate startDate, LocalDate finalDate, String imgClass, Integer semester, String code, CourseSimpleResponseDTO course, List<SectionResponseDTO> sections) {

    public ClassResponseDTO(Class clazz) {
        this(clazz.getId(), clazz.getName(), clazz.getStartDate(), clazz.getEndDate(), clazz.getImgClass(), clazz.getSemester(), clazz.getCode(), new CourseSimpleResponseDTO(clazz),
                clazz.getSectionClasses()
                     .stream()
                     .map(sec -> new SectionResponseDTO(sec.getSection()))
                     .collect(Collectors.toList()));
    }

    public record CourseSimpleResponseDTO(Long id, String name) {

        public CourseSimpleResponseDTO(Class clazz) {
            this(clazz.getCourseId(), clazz.getCourse() != null ? clazz.getCourse().getName() : null);
        }

    }

}
