package senai.com.ava_senai.domain.course.clazz.classassessment;

import lombok.Data;
import senai.com.ava_senai.domain.task.feedback.FeedbackResponseDTO;

@Data
public class TaskUserAssessmentDTO {

    private Long idUser;
    private Long taskId;
    private Long id;
    private TaskAssessmentDTO task;
    private UserResponseAssessmentDTO userResponse;
    private FeedbackResponseDTO feedback;
}
