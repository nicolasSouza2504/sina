package senai.com.ava_senai.domain.course.clazz.classassessment;


import lombok.Data;
import senai.com.ava_senai.domain.user.UserStatus;
import senai.com.ava_senai.domain.user.role.Role;

import java.util.List;

@Data
public class UserAssessmentDTO {

    private Long id;
    private String email;
    private String nome;
    private UserStatus status;
    private Role role;
    private String institutionName;
    private String cpf;
    private List<TaskUserAssessmentDTO> tasksAssessment;

}
