package senai.com.ava_senai.domain.course.clazz.classassessment;

import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class TaskAssessmentDTO {

    private Long id;
    private String name;
    private String description;
    private Date dueDate;
    private Long knowledgeTrailId;

}
