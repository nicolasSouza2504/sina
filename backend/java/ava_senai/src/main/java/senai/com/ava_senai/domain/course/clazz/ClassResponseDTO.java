package senai.com.ava_senai.domain.course.clazz;

import java.time.LocalDate;

public record ClassResponseDTO(Long Id, String nome, LocalDate startDate, LocalDate finalDate, String imgClass, Integer semester, String code, CourseSimpleResponseDTO course) {

    public ClassResponseDTO(Class clazz) {
        this(clazz.getId(), clazz.getName(), clazz.getStartDate(), clazz.getEndDate(), clazz.getImgClass(), clazz.getSemester(), clazz.getCode(), new CourseSimpleResponseDTO(clazz));
    }

    public record CourseSimpleResponseDTO(Long id, String name) {

        public CourseSimpleResponseDTO(Class clazz) {
            this(clazz.getCourseId(), clazz.getCourse() != null ? clazz.getCourse().getName() : null);
        }

    }

}
