package senai.com.ava_senai.domain.task.userresponse;

import senai.com.ava_senai.domain.task.taskuser.TaskUserResponseDTO;
import senai.com.ava_senai.domain.task.userresponsecontent.UserResponseContentResponseDTO;

import java.util.List;

public record UserResponseSummaryDTO(Long id, String comment, TaskUserResponseDTO taskUser, List<UserResponseContentResponseDTO> contents) {

    public UserResponseSummaryDTO(UserResponse userResponse) {
        this(
                userResponse.getId(),
                userResponse.getComment(),
                new TaskUserResponseDTO(userResponse.getTaskUser()),
                userResponse.getUserResponseContents().stream().map(UserResponseContentResponseDTO::new).toList()
        );
    }
}
