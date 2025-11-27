package senai.com.ava_senai.domain.course.clazz.classassessment;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ClassAssessmentResponseDTO {

    private Long id;
    private String nome;
    private LocalDate startDate;
    private LocalDate finalDate;
    private String imgClass;
    private Integer semester;
    private String code;

    private CourseSimpleResponseDTO course;
    private List<UserAssessmentDTO> users;

    @Data
    public static class CourseSimpleResponseDTO {
        private Long id;
        private String name;
    }

}
