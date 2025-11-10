package senai.com.ava_senai.domain.task.feedback;

import senai.com.ava_senai.domain.task.userresponse.UserResponseResponseDTO;
import senai.com.ava_senai.domain.user.UserResponseDTO;

public record FeedbackResponseDTO(Long id, UserResponseDTO teacher, UserResponseResponseDTO response, String comment, Double grade) {

    public FeedbackResponseDTO(Feedback feedback) {
        this(
            feedback.getId(),
            new UserResponseDTO(feedback.getTeacher()),
            new UserResponseResponseDTO(feedback.getUserResponse()),
            feedback.getComment(),
            feedback.getGrade()
        );
    }

}
