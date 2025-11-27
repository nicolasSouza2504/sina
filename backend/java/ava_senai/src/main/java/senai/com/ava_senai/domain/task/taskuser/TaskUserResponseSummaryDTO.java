package senai.com.ava_senai.domain.task.taskuser;

import senai.com.ava_senai.domain.task.feedback.FeedbackResponseDTO;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;
import senai.com.ava_senai.domain.task.userresponse.UserResponseSummaryDTO;

import java.util.Optional;

public record TaskUserResponseSummaryDTO(Long idUser, Long taskId, Long id,
        UserResponseSummaryDTO userResponse, FeedbackResponseDTO feedback) {
    public TaskUserResponseSummaryDTO(TaskUser taskUser, Optional<UserResponse> userResponse) {
        this(taskUser.getUserId(), taskUser.getTaskId(), taskUser.getId(),
                userResponse.isPresent() ? new UserResponseSummaryDTO(userResponse.get()) : null,
                userResponse.isPresent() && userResponse.get().getFeedback() != null 
                    ? new FeedbackResponseDTO(userResponse.get().getFeedback()) : null);
    }
}
