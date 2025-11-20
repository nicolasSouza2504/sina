package senai.com.ava_senai.domain.course.clazz.classassessment;

import lombok.Data;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContentDTO;

import java.util.List;

@Data
public class UserResponseAssessmentDTO {

    private Long id;
    private String comment;

    private List<UserResponseContentDTO> contents;
}
