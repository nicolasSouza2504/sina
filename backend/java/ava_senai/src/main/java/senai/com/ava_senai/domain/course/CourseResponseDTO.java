package senai.com.ava_senai.domain.course;

import senai.com.ava_senai.domain.course.clazz.ClassResponseDTO;

import java.util.List;

public record CourseResponseDTO(String name, Integer quantitySemester, Long id, List<ClassResponseDTO> classes) {

    public CourseResponseDTO(Course course) {
        this(course.getName(), course.getQuantitySemester(), course.getId(),
                course.getClasses() != null ? course.getClasses().stream().map(ClassResponseDTO::new).toList() : null);
    }

}
