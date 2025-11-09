package senai.com.ava_senai.domain.task.taskuser;

import java.util.Optional;
import senai.com.ava_senai.domain.task.userresponse.UserResponse;
import senai.com.ava_senai.domain.task.userresponse.UserResponseSummaryDTO;

public record TaskUserResponseSummaryDTO(Long idUser, Long taskId, Long id,
        UserResponseSummaryDTO userResponse) {
    public TaskUserResponseSummaryDTO(TaskUser taskUser, Optional<UserResponse> userResponse) {
        this(taskUser.getUserId(), taskUser.getTaskId(), taskUser.getId(),
                userResponse.isPresent() ? new UserResponseSummaryDTO(userResponse.get()) : null);
    }
}
