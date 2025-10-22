package senai.com.ava_senai.domain.course.clazz;

import senai.com.ava_senai.domain.course.Course;

import java.time.LocalDate;

public record ClassResponseDTO(Long Id, String nome, LocalDate startDate, LocalDate finalDate, String imgClass, Integer semester, String code, CourseSimpleResponseDTO course) {

    public ClassResponseDTO(Class clazz) {
        this(clazz.getId(), clazz.getName(), clazz.getStartDate(), clazz.getEndDate(), clazz.getImgClass(), clazz.getSemester(), clazz.getCode(), new CourseSimpleResponseDTO(clazz.getCourse()));
    }

    public record CourseSimpleResponseDTO(Long id, String name) {

        public CourseSimpleResponseDTO(Course course) {
            this(course.getId(), course.getName());
        }

    }

}
